import {
  gql,
  OnSubscriptionDataOptions,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import firebase from "firebase";
import { useCallback, useEffect, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { MyMessages } from "../graphql/MyMessages";
import { OnMessageReceived, OnMessageReceived_newMessages } from "../graphql/OnMessageReceived";
import { useAuthState } from 'react-firebase-hooks/auth';
import { AddMessage } from "../graphql/AddMessage";
import { MyGroups_me_groups_StudyGroup } from "../graphql/MyGroups";


const MESSAGES_QUERY = gql`
query MyMessages($groupId: ID!) {
  getMessages(groupID: $groupId) {
    text
    user {
      id
      name
    }
    group {
      id
    }
    createdAt
  }
}
`;

const ADD_MESSAGE = gql`
mutation AddMessage($send: String!, $groupId: ID!) {
  addMessage(message: { text: $send, groupID: $groupId }) {
    id
  }
}
`;

const MESSAGES_SUBSCRIPTION = gql`
subscription OnMessageReceived($uid: ID!) {
  newMessages(uid: $uid) {
    text
    group {
      id
    }
    user {
      id
      name
    }
    createdAt
  }
}
`;

const GROUPS_QUERY = gql`
  query MyGroups {
    me {
      groups {
        ... on DMGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on ClassGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on CourseGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on StudyGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
      }
    }
  }
`;

// note that this takes an OnMessageReceived_newMessages, but the queries are
// written such that MyMessages_getMessages has the exact same type.
const toChatMessage = (
  data: OnMessageReceived_newMessages,
  uid: string
): ChatMessage => {
  return {
    sender: data.user.id,
    text: data.text,
    direction: data.user.id === uid ? "right" : "left",
    groupId: data.group.id,
    createdAt: new Date(data.createdAt),
  };
};

type MessagesObject = {
  [groupId: string]: ChatMessage[]
}

export const useMessagesAndContacts = () => {
  const [contacts, setContacts] = useState([] as MyGroups_me_groups_StudyGroup[]);
  const [groupId, setGroupId] = useState(null as string | null);

  const [user, userLoading] = useAuthState(firebase.auth());
  const uid = user?.uid;

  // chat messages as ChatMessage items.
  const [groupMessages, setGroupMessages] = useState([] as ChatMessage[]);

  // mutation to send a new message to the server.
  const [sendMessage] = useMutation<AddMessage>(ADD_MESSAGE);

  // get my messages for a specific contact group.
  const { data, loading, refetch } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: groupId },
  });

  useEffect(() => {
    refetch({ groupId });
  }, [groupId]);

  // FIXME: i feel like this is dodgy :/
  let contact = props.contacts
    ? props.contacts.filter((c) => c.id === id)[0]
    : null;
  if (contact && !contact.readStatus) {
    contact.readStatus = true;
    if (props.setContacts)
      props.setContacts([
        contact,
        ...props.contacts!.filter((c) => c.id !== id),
      ]);
  }

  // subscription handler to add a new received message.
  const handleNewMessage = useCallback(
    (options: OnSubscriptionDataOptions<OnMessageReceived>) => {
      const data = options.subscriptionData.data?.newMessages;

      if (data) {
        if (data.group.id !== id && props.contacts) {
          // FIXME: i feel like this is dodgy :/ (perhaps abstract to a function?)
          let contact = props.contacts.filter((c) => c.id === data.group.id)[0];
          contact.readStatus = false;
          if (props.setContacts)
            props.setContacts([
              contact,
              ...props.contacts.filter((c) => c.id !== data.group.id),
            ]);
          return; // not the selected group
        }
        setNewMessages([...newMessages, toChatMessage(data, uid!)]);
      }
    },
    [newMessages, uid]
  );

  // subscribe to incoming messages with the above handler.
  const { data: subData } = useSubscription<OnMessageReceived>(
    MESSAGES_SUBSCRIPTION,
    {
      variables: { uid },
      onSubscriptionData: handleNewMessage,
    }
  );

  // when data changes, update oldMessages.
  useEffect(() => {
    if (!data) return;

    const oldMessages: ChatMessage[] =
      data?.getMessages?.map((x) => toChatMessage(x, uid!)) ?? [];

    oldMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    setOldMessages(oldMessages);
  }, [data, uid]);

  // reset cached messages when group id changes.
  useEffect(() => {
    refetch();
    setNewMessages([]);
  }, [id]);

}
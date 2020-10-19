import {
  gql,
  OnSubscriptionDataOptions,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import firebase from "firebase";
import { useCallback, useEffect, useMemo, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { MyMessages } from "../graphql/MyMessages";
import {
  OnMessageReceived,
  OnMessageReceived_newMessages,
} from "../graphql/OnMessageReceived";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AddMessage,
  AddMessageVariables,
  AddMessage_addMessage,
} from "../graphql/AddMessage";
import {
  MyGroups,
  MyGroups_me_groups,
  MyGroups_me_groups_StudyGroup,
} from "../graphql/MyGroups";
import { createContainer } from "unstated-next";

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
          lastActive
          users {
            id
            name
            avatar
          }
        }
        ... on ClassGroup {
          id
          name
          lastActive
          users {
            id
            name
            avatar
          }
        }
        ... on CourseGroup {
          id
          name
          lastActive
          users {
            id
            name
            avatar
          }
        }
        ... on StudyGroup {
          id
          name
          lastActive
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

const sortContacts = (a: MyGroups_me_groups, b: MyGroups_me_groups) => {
  return -(Date.parse(a.lastActive) - Date.parse(b.lastActive));
};

const sortChatMessages = (a: ChatMessage, b: ChatMessage) => {
  return a.createdAt.getTime() - b.createdAt.getTime();
};

type MessagesObject = {
  [groupId: string]: ChatMessage[];
};

export const useMessaging = () => {
  const [contacts, setContacts] = useState([] as MyGroups_me_groups[]);
  const [groupId, setGroupId] = useState(null as number | null);

  const [user, userLoading] = useAuthState(firebase.auth());
  const username = user?.email?.split("@")?.[0];

  // chat messages gropued by group, as ChatMessage items.
  const [groupMessages, setGroupMessages] = useState({} as MessagesObject);

  // chat messages for the currently selected gropu, or null if loading.
  const [messages, setMessages] = useState(null as ChatMessage[] | null);

  // mutation to send a new message to the server.
  const [sendToServer] = useMutation<AddMessage>(ADD_MESSAGE);

  // get my messages for a specific contact group.
  const [
    fetchMessages,
    { data: messagesData, loading, refetch },
  ] = useLazyQuery<MyMessages>(MESSAGES_QUERY);

  useEffect(() => {
    if (groupId != null) {
      setMessages(null);
      if (!refetch) {
        fetchMessages({ variables: { groupId } });
      } else {
        refetch({ variables: { groupId } });
      }
    }
  }, [groupId]);

  const { data: groupData } = useQuery<MyGroups>(GROUPS_QUERY);

  useEffect(() => {
    if (!groupData) return;
    setContacts(groupData.me?.groups ?? []);
  }, [groupData]);

  const sortedContacts = useMemo(() => {
    // sort by most recent messages first.
    const sorted = [...contacts];
    sorted.sort(sortContacts);
    return sorted;
  }, [contacts, groupMessages]);

  // subscription handler to add a new received message.
  const handleNewMessage = useCallback(
    (options: OnSubscriptionDataOptions<OnMessageReceived>) => {
      const data = options.subscriptionData.data?.newMessages;

      console.log("received " + data);

      if (data && username) {
        const groupId = data.group.id;
        const messages = groupMessages[groupId] ?? [];

        setGroupMessages({
          ...groupMessages,
          [groupId]: [...messages, toChatMessage(data, username)],
        });
      }
    },
    [username]
  );

  // subscribe to incoming messages with the above handler.
  const { data: subscriptionData } = useSubscription<OnMessageReceived>(
    MESSAGES_SUBSCRIPTION,
    {
      variables: { uid: username },
      onSubscriptionData: handleNewMessage,
    }
  );

  // when data changes, update oldMessages.
  useEffect(() => {
    if (!messagesData || !username) return;

    const groupId = messagesData.getMessages[0]?.group?.id;
    const messages = messagesData.getMessages.map((x) =>
      toChatMessage(x, username)
    );
    messages.sort(sortChatMessages);

    if (groupId) {
      setGroupMessages((groupMessages) => ({
        ...groupMessages,
        [groupId!]: messages,
      }));
    }
  }, [groupId, messagesData, username]);

  useEffect(() => {
    if (groupId != null) {
      setMessages(groupMessages[groupId] ?? []);
    }
  }, [groupId, groupMessages]);

  const sendMessage = useCallback(
    (args: AddMessageVariables) => {
      setGroupMessages((groupMessages) => ({
        ...groupMessages,

        [args.groupId]: [
          ...(groupMessages[args.groupId] ?? []),
          {
            text: args.send,
            sender: username!,
            direction: "right",
            groupId: args.groupId,
            createdAt: new Date(),
          },
        ],
      }));

      sendToServer({ variables: args });
    },
    [username]
  );

  return {
    contacts: sortedContacts,
    groupMessages: messages,
    setGroupId,
    sendMessage,
    username,
  };
};

export const Messaging = createContainer(useMessaging);

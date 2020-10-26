import {
  FetchResult,
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
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
import { AddMessage, AddMessageVariables } from "../graphql/AddMessage";
import { MyGroups, MyGroups_me_groups } from "../graphql/MyGroups";
import { createContainer } from "unstated-next";

const MESSAGES_QUERY = gql`
  query MyMessages($groupId: ID!) {
    getMessages(groupID: $groupId) {
      id
      text
      user {
        id
        name
      }
      group {
        id
        users {
          id
        }
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
  subscription OnMessageReceived {
    newMessages {
      id
      text
      group {
        id
        users {
          id
        }
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
    senderName: data.user.name,
    text: data.text,
    direction: data.user.id === uid ? "right" : "left",
    groupId: data.group.id,
    group: data.group.users.length > 2,
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

/**
 * Messaging manager, provided via context to be shared by all components which
 * interact with messaging or contacts.
 */
export const useMessaging = () => {
  // list of contacts from server, not sorted.
  const [contacts, setContacts] = useState(null as MyGroups_me_groups[] | null);
  // currently active group id
  const [groupId, setGroupId] = useState(null as number | null);

  // currently logged in user object and username (split from email)
  const [user] = useAuthState(firebase.auth());
  const username = user?.email?.split("@")?.[0];

  // chat messages grouped by group, as ChatMessage items.
  const [groupMessages, setGroupMessages] = useState({} as MessagesObject);

  // chat messages for the currently selected gropu, or null if loading.
  const [messages, setMessages] = useState(null as ChatMessage[] | null);

  // mutation to send a new message to the server.
  const [sendToServer] = useMutation<AddMessage>(ADD_MESSAGE);

  // get my messages for a specific contact group.
  const [fetchMessages, { data: messagesData }] = useLazyQuery<MyMessages>(
    MESSAGES_QUERY
  );

  // when selected group id changes, fetch new messages for that group.
  useEffect(() => {
    if (groupId != null) {
      setMessages(null);
      // console.log("fetching messages for " + groupId)
      fetchMessages({ variables: { groupId } });
    }
  }, [groupId]);

  // fetch contacts list from server
  const { data: groupData } = useQuery<MyGroups>(GROUPS_QUERY);

  // set contacts once received from server
  useEffect(() => {
    if (!groupData) return;
    setContacts(groupData.me?.groups ?? []);
  }, [groupData]);

  // sorted version of contacts. sort by most recent messages first.
  const sortedContacts = useMemo(() => {
    if (!contacts) return null;
    const sorted = [...contacts];
    sorted.sort(sortContacts);
    return sorted;
  }, [contacts]);

  // console.log("username " + username);

  // when we receive data for the selected group, update messages
  useEffect(() => {
    if (!messagesData || !username) return;

    const messagesGroupId = messagesData.getMessages[0]?.group?.id;
    const messages = messagesData.getMessages.map((x) =>
      toChatMessage(x, username)
    );
    messages.sort(sortChatMessages);

    // console.log('received message data', messages)

    // console.log(messagesData.getMessages);
    if (groupId?.toString() === messagesGroupId?.toString()) {
      setGroupMessages((groupMessages) => ({
        ...groupMessages,
        [groupId!]: messages,
      }));
    }
  }, [groupId, messagesData, username]);

  // when groupMessages or groupId changes, obtain the messages for the current
  // group from groupMessages.
  useEffect(() => {
    // console.log(groupId);
    // console.log(groupMessages);
    if (groupId != null) {
      setMessages(groupMessages[groupId] ?? []);
    }
  }, [groupId, groupMessages]);

  // bumps the contact with the given id to be the most recently contacted.
  // used when message is received. should be called with message is sent.
  const bumpContact = useCallback((id: string) => {
    setContacts((contacts) => {
      if (!contacts) return contacts;
      contacts = [...contacts];
      for (let i = 0; i < contacts.length; i++) {
        const c = contacts[i];
        if (c.id === id) {
          contacts[i] = {
            ...c,
            lastActive: new Date(),
          };
        }
      }
      return contacts;
    });
  }, []);

  // subscription handler to add a new received message.
  const handleNewMessage = useCallback(
    (options: FetchResult<OnMessageReceived>) => {
      // console.log(options);
      const data = options.data?.newMessages;

      // console.log("received " + data);

      if (data && username) {
        const groupId = data.group.id;

        setGroupMessages((groupMessages) => ({
          ...groupMessages,
          [groupId]: [
            ...(groupMessages[groupId] ?? []),
            toChatMessage(data, username!),
          ],
        }));

        bumpContact(groupId);
      }
    },
    [username, bumpContact]
  );

  // reference to apollo client.
  const client = useApolloClient();
  // we need to set up subscriptions manually to handle changing variables.
  useEffect(() => {
    const observer = client.subscribe({
      query: MESSAGES_SUBSCRIPTION,
    });

    const subscription = observer.subscribe(handleNewMessage);

    return () => subscription.unsubscribe();
  }, [handleNewMessage]);

  // callback to send a message to the server and bump the contact.
  // message is received back via subscription.
  const sendMessage = useCallback(
    (args: AddMessageVariables) => {
      sendToServer({ variables: args });
      if (username) bumpContact(username);
    },
    [username, bumpContact]
  );

  return {
    contacts: sortedContacts,
    groupMessages: messages,
    setGroupMessages,
    groupId,
    setGroupId,
    sendMessage,
    username,
    _bumpContact: bumpContact,
  };
};

export const Messaging = createContainer(useMessaging);

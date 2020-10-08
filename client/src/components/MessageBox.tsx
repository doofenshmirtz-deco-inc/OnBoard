import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import {
  gql,
  OnSubscriptionDataOptions,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import { MyMessages } from "../graphql/MyMessages";
import ChatMessage from "./ChatMessage";
import Message from "./Message";
import {
  OnMessageReceived,
  OnMessageReceived_newMessages,
} from "../graphql/OnMessageReceived";
import { Contact } from "../modules/StudyRooms/Recents";
import * as firebase from "firebase";
import { useParams } from "react-router";

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
      }
      createdAt
    }
  }
`;

// TODO: interfaces for types

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    paddingLeft: "2%",
    height: "69vh",
    overflowY: "hidden",
  },
  messagingContainer: {
    overflowY: "scroll",
    height: "75%",
  },
  sendBar: {
    width: "100%",
    position: "relative",
    bottom: "0",
  },
  bubbleContainer: {
    width: "100%",
    display: "flex",
  },
  bubble: {
    borderRadius: "20px",
    margin: "1px",
    padding: "10px",
    display: "inline-block",
    maxWidth: "40%",
    marginRight: "10px",
  },
  right: {
    justifyContent: "flex-end",
  },
  left: {
    justifyContent: "flex-start",
  },
  me: {
    backgroundColor: "#c9c9c9",
  },
  other: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

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

const renderChatMessage = (message: ChatMessage) => {
  const key = `${message.createdAt}-${message.sender}-${message.groupId}`;
  return (
    <Message key={key} direction={message.direction} text={message.text} />
  );
};

export type MessageBoxProps = {
  id?: string; // group id of chat.
  name?: string; // name of group
  onSentMessage?: () => any; // to be called when new message is received.
  contacts?: Contact[]; // all the contacts
  setContacts?: Dispatch<SetStateAction<Contact[]>>; // setContacts from parent (recents.tsx)
};

// TODO: clear input message when changing contact
const MessageBox = (props: MessageBoxProps) => {
  const classes = useStyles();

  const { groupID } = useParams();

  const uid = firebase.auth().currentUser?.uid;
  const id = props.id ? props.id : groupID;

  // current message being typed in text box.
  const [messageInput, setMessageInput] = useState("");
  // existing chat messages as ChatMessage items.
  const [oldMessages, setOldMessages] = useState([] as ChatMessage[]);
  // new messages obtained via subscription.
  const [newMessages, setNewMessages] = useState([] as ChatMessage[]);

  // reference to end of messages, to scroll to bottom on new message.
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  });

  // mutation to send a new message to the server.
  const [sendToServer] = useMutation(ADD_MESSAGE);

  console.log(id);

  // get my messages for a specific contact group.
  const { data, loading, refetch } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: id },
  });

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

  if (!data || loading) {
    return <LoadingPage />;
  }

  const sendMessage = (message: string) => {
    if (message === "") {
      return;
    }

    setNewMessages([...newMessages, {
      text: message,
      sender: props.uid,
      direction: "right",
      groupId: props.id,
      createdAt: new Date()
    }]);
    
    setMessageInput("");
    props.onSentMessage?.();

    sendToServer({
      variables: {
        send: message,
        groupId: id,
      },
    });
  };

  return (
    <div className={classes.container}>
      {props.name ? (
        <h1>
          {props.name} <VideocamIcon />
        </h1>
      ) : (
        <> </>
      )}
      <div className={classes.messagingContainer}>
        {oldMessages.map(renderChatMessage)}
        {newMessages.map(renderChatMessage)}
        <div ref={messagesEndRef} />
      </div>
      <TextField
        className={classes.sendBar}
        style={{ marginTop: "10px" }}
        variant="outlined"
        id="message-send"
        label="Send message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage(messageInput);
          }
        }}
        InputProps={{
          endAdornment: (
            <Button onClick={() => sendMessage(messageInput)}>
              <SendIcon />
            </Button>
          ),
        }}
      />
    </div>
  );
};

export default MessageBox;

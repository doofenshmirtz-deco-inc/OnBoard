import React, { useState, useLayoutEffect, useEffect, useCallback } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import { gql, OnSubscriptionDataOptions, useMutation, useQuery, useSubscription } from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import { MyMessages } from "../graphql/MyMessages";
import ChatMessage from "./ChatMessage";
import Message from "./Message";
import { OnMessageReceived, OnMessageReceived_newMessages } from "../graphql/OnMessageReceived";

const MESSAGES_QUERY = gql`
  query MyMessages($groupId: ID!) {
    getMessages(groupID: $groupId) {
      text
      user {
        id
        name
      }
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

const mapMessages = (data: MyMessages, myId: string) => {
  return data.getMessages.map((msg) => {
    return {
      text: msg.text,
      direction: msg.user.id === myId ? "right" : "left",
      sender: msg.user.id,
      // TODO: change groupId
      groupId: 0
    } as ChatMessage;
  });
};


export type MessageBoxProps = {
  uid: string, // uid of this user.
  id: string, // group id of chat.
  name: string, // name of chat.
  onNewMessage?: () => any, // to be called when new message is received.
}

const MessageBox = (props: MessageBoxProps) => {

  const classes = useStyles();

  // current message being typed in text box.
  const [messageInput, setMessageInput] = useState("");
  // all chat messages as Message elements.
  const [chatBubbles, setChatBubbles] = useState([] as JSX.Element[]);
  // new messages obtained via subscription.
  const [newMessages, setNewMessages] = useState([] as OnMessageReceived_newMessages[]);

  // reference to end of messages, to scroll to bottom on new message.
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  });

  // mutation to send a new message to the server.
  const [sendToServer] = useMutation(ADD_MESSAGE);

  // get my messages for a specific contact group.
  const { data, loading, refetch } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: props.id },
  });

  // subscription handler to add a new received message.
  const handleNewMessage = useCallback((options: OnSubscriptionDataOptions<OnMessageReceived>) => {
    const newMessage = options.subscriptionData.data?.newMessages;
    console.log(options.subscriptionData.data);
    
    if (newMessage) {
      setNewMessages([...newMessages, newMessage]);
      props.onNewMessage?.();
    }
  }, [newMessages]);

  // subscribe to incoming messages with the above handler.
  const {data: subData} = useSubscription<OnMessageReceived>(MESSAGES_SUBSCRIPTION, {
    variables: { uid: props.uid },
    onSubscriptionData: handleNewMessage,
  });

  // when data or newMessages changes, update chatBubbles.
  useEffect(() => {
    if (!data)
      return;
    
    const newChatBubbles = data?.getMessages?.map((obj, i) => (
      <Message direction={obj.user.id === props.uid ? "right" : "left"} text={obj.text} key={i} />
    )) ?? [];
    newChatBubbles.reverse(); // reverse so newer messages are at bottom.
    const numChatBubbles = newChatBubbles.length;

    newMessages.forEach((m, i) => {
      newChatBubbles.push(
        <Message direction={m.user.id === props.uid ? "right" : "left"} text={m.text} key={100*numChatBubbles + i}/>
      );
    });

    setChatBubbles(newChatBubbles);

  }, [data, newMessages, props.uid]);

  // reset cached messages when group id changes.
  useEffect(() => {
    refetch();
    setNewMessages([]);
  }, [props.id]);

  if (!data || loading) {
    return <LoadingPage />;
  }

  const sendMessage = (message: string) => {
    if (message === "") {
      return;
    }

    setMessageInput("");

    sendToServer({
      variables: {
        send: message,
        groupId: props.id,
      },
    });
  };
  
  return (
    <div className={classes.container}>
      <h1>
        {props.name} <VideocamIcon />
      </h1>
      <div className={classes.messagingContainer}>
        {chatBubbles}
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

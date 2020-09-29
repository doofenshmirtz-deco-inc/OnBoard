import React, { useState, useEffect, useLayoutEffect } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import { MyMessages } from "../graphql/MyMessages";
import { OnMessageSent } from "../graphql/OnMessageSent";
import { group } from "console";

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

// the subscription should run for all groups at all times
const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageSent($groupId: ID!) {
    newMessages(groupID: $groupId) {
      text
    }
  }
`;

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

const sendMessage = (
  send: string,
  messages: any[],
  setMessages: any,
  setMessageSent: any,
  props: any
) => {
  if (send == "") {
    return;
  }

  messages.push({
    message: send,
    direction: "right",
    sender: props.myId,
  });

  setMessages(messages);
  setMessageSent("");

  // TODO: probably change this to a splay tree or something?
  let contacts: any[] = props.contacts;
  let index = -1;
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === props.id) {
      index = i;
      break;
    }
  }

  let newContacts: any[] = [contacts[index]];
  for (let i = 0; i < contacts.length; i++) {
    if (i !== index) {
      newContacts.push(contacts[i]);
    }
  }

  props.setContacts(newContacts);
};

const handleKeyPress = (
  event: any,
  send: string,
  messages: any[],
  setMessages: any,
  setMessageSent: any,
  props: any
) => {
  if (event.key == "Enter") {
    sendMessage(send, messages, setMessages, setMessageSent, props);
  }
};

const mapMessages = (data: MyMessages, myId: string) => {
  return data.getMessages.map((msg) => {
    return {
      text: msg.text,
      direction: msg.user.id == myId ? "right" : "left",
      sender: msg.user.name,
    };
  });
};

const MessageBox = (props: any) => {
  const [message, setMessageSent] = useState("");
  const [messages, setMessages] = useState([{}]);
  const classes = useStyles();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  });

  const { subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: { groupId: props.id },
  });

  useEffect(() => {
    subscribeToMore<OnMessageSent>({
      document: MESSAGES_SUBSCRIPTION,
      variables: { groupId: props.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.newMessages;
        return Object.assign({}, prev, {
          getMessages: [newMessage, ...messages],
        });
      },
    });
  });

  const [sendToServer] = useMutation(ADD_MESSAGE);

  // get my messages for a specific contact
  const { data } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: props.id },
  });

  if (!data) {
    return <LoadingPage />;
  }

  // if none of the contacts have been selected, render an empty div (no messages)
  // if (props.name === "" || props.id === "INVALID") {
  //   return <div />;
  // }

  const maps = mapMessages(data, props.myId);
  const chatBubbles = maps.map((obj: any, i: number = 0) => (
    <div
      className={`${classes.bubbleContainer} ${
        obj.direction == "left" ? classes.left : classes.right
      }`}
      key={i}
    >
      <div
        key={i++}
        className={`${classes.bubble} ${
          obj.direction == "left" ? classes.other : classes.me
        }`}
      >
        <div>{obj.text}</div>
      </div>
    </div>
  ));

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
        value={message}
        onChange={(e) => setMessageSent(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleKeyPress(
              e,
              message,
              messages,
              setMessages,
              setMessageSent,
              props
            );
            sendToServer({
              variables: {
                send: message,
                groupId: props.id,
              },
            });
          }
        }}
        InputProps={{
          endAdornment: (
            <Button
              onClick={() =>
                sendMessage(
                  message,
                  messages,
                  setMessages,
                  setMessageSent,
                  props
                )
              }
            >
              <SendIcon />
            </Button>
          ),
        }}
      />
    </div>
  );
};

export default MessageBox;

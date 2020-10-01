import React, { useState, useLayoutEffect } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import { MyMessages } from "../graphql/MyMessages";
import ChatMessage from "./ChatMessage";
import Message from "./Message";

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

// TODO: interfaces for types

export const useStyles = makeStyles((theme) => ({
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

const MessageBox = (props: any) => {
  const [message, setMessageSent] = useState("");
  const [messages, setMessages] = useState(new Map<number, JSX.Element[]>());
  const updateMap = (k: number, v: any) => {
    setMessages(new Map(messages.set(k, v)));
  }

  const classes = useStyles();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  });

  const [sendToServer] = useMutation(ADD_MESSAGE);

  // get my messages for a specific contact
  const { data } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: props.id },
  });

  if (!data) {
    return <LoadingPage />;
  }

  const send = (message: string) => {
    if (message === "") {
      return;
    }

    const newMessage = {
      text: message,
      direction: "right",
      sender: props.myId,
    };

    setMessageSent("");

    // TODO: probably change this to a splay tree or something?
    const contacts: any[] = props.contacts;
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
    console.log(newContacts);

    sendToServer({
      variables: {
        send: message,
        groupId: props.id,
      },
    });
  };

  let chatBubbles = data.getMessages.map((obj: any, i: number) => (
    <Message direction={obj.user.id === props.id ? "right" : "left"} text={obj.text} key={i} />
  ));
  
  if (!messages.has(props.id)) {
    updateMap(props.id, chatBubbles);
  }

  // console.log(props.newMessage);
  if (props.newMessage.groupId === props.id) {
    console.log("messagebox says hi 2");
    chatBubbles.push(<Message direction={props.newMessage.direction} text={props.newMessage.text} />);
    updateMap(props.id, chatBubbles);
    props.setNewMessage({} as ChatMessage);
  }

  return (
    <div className={classes.container}>
      <h1>
        {props.name} <VideocamIcon />
      </h1>
      <div className={classes.messagingContainer}>
        {messages.get(props.id)}
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
            send(message);
          }
        }}
        InputProps={{
          endAdornment: (
            <Button onClick={() => send(message)}>
              <SendIcon />
            </Button>
          ),
        }}
      />
    </div>
  );
};

export default MessageBox;

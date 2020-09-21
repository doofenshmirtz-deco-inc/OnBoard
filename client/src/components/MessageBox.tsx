import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import VideocamIcon from '@material-ui/icons/Videocam';
import { gql, useQuery } from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import { MeId } from "../graphql/MeId";
import { MyMessages } from "../graphql/MyMessages";

const useStyles = makeStyles(theme => ({
  container: {
      width: "100%",
      paddingLeft: "2%",
      height: "70vh",
  },
  messagingContainer: {
    height: "60vh",
    overflowY: "scroll",
  },
  sendBar: {
    width: "70%",
    position:"absolute",
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
      maxWidth: "40%"
  },
  right: {
    justifyContent: "flex-end"
  },
  left: {
    justifyContent: "flex-start"
  },
  me: {
    backgroundColor: "#c9c9c9"
  },
  other: {
    backgroundColor: theme.palette.secondary.main
  }
}));

const MESSAGES_QUERY = gql`
query MyMessages($groupId: Float!) {
  getMessages(groupID: $groupId) {
    text
    user {
      id
      name
    }
  }
}
`;

const groupsQuery = gql`
query MyGroups {
  me {
    groups {
      id
    }
  }
}
`;

const ME_QUERY = gql`
query MeId {
  me {
    id
  }
}
`;

const sendMessage = (send: string, messages: any[], setMessages: any, setMessageSent: any, myId: string) => {
  if (send == "") {
    return;
  }

  messages.push({
    message: send,
    direction: "right",
    sender: myId
  });
  setMessages(messages);
  setMessageSent("");
}

const handleKeyPress = (event: any, send: string, messages: any[], setMessages: any, setMessageSent: any, myId: string) => {
  if (event.key == 'Enter') {
    sendMessage(send, messages, setMessages, setMessageSent, myId);
  }
}

const mapMessages = (data: MyMessages, myId: string) => {
  return data.getMessages.map((msg) => {
    return {
      text: msg.text,
      direction: msg.user.id == myId ? "right" : "left",
      sender: msg.user.id
    }
  })
}
  
const MessageBox = (props: any) => {
  const [message, setMessageSent] = useState("");
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) { 
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  // get my id
  const me = useQuery<MeId>(ME_QUERY);

  // get my messages for a specific contact
  const { data } = useQuery<MyMessages>(MESSAGES_QUERY, {
    variables: { groupId: 4 },
  });

  if (!data || !me.data || !me.data.me) {
    return <LoadingPage />
  }

  // if none of the contacts have been selected, render an empty div (no messages)
  if (props.name == "") {
    return <div/>;
  }

  const myId = me.data.me.id;
  const maps = mapMessages(data, myId);
  const chatBubbles = maps.map((obj : any, i: number = 0) => (
    <div className={`${classes.bubbleContainer} ${obj.direction == "left" ? classes.left : classes.right}`} key={i}>
      <div key={i++} className={`${classes.bubble} ${obj.direction == "left" ? classes.other : classes.me}`}>
          <div>{obj.text}</div>
      </div>
    </div>
  ));

  return <div className={classes.container}>
    <h1>{props.name} <VideocamIcon/></h1>
    <div className={classes.messagingContainer}>
      {chatBubbles}
      <div ref={messagesEndRef}/>
    </div>
    <TextField
        className={classes.sendBar}
        style={{marginTop: "10px"}}
        variant="outlined"
        id="message-send"
        label="Send message"
        value={message}
        onChange={(e) => setMessageSent(e.target.value)}
        onKeyPress={(e) => handleKeyPress(e, message, messages, setMessages, setMessageSent, myId)}
        InputProps={{
          endAdornment: (
            <Button onClick={() => sendMessage(message, messages, setMessages, setMessageSent, myId)}>
              <SendIcon/>
            </Button>
          )
        }}
      />
  </div>;
};

export default MessageBox;
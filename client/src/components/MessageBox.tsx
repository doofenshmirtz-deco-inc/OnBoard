import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import VideocamIcon from '@material-ui/icons/Videocam';

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

const sendMessage = (send: string, messages: any[], setMessages: any, setMessageSent: any) => {
  console.log(send);
  if (send == "") {
    return;
  }

  messages.push({
    message: send,
    direction: "right"
  });
  setMessages(messages);
  setMessageSent("");
}

const handleKeyPress = (event: any, send: string, messages: any[], setMessages: any, setMessageSent: any) => {
  if (event.key == 'Enter') {
    sendMessage(send, messages, setMessages, setMessageSent);
  }
}
  
const MessageBox = (props: any) => {
  const [message, setMessageSent] = useState("");
  const classes = useStyles();
  let dummyData = [
    {
      message: "1: This should be in left and is a super long message but in blue because why not gotta check it out for the aesthetics woohoo design skills 100 i am the best designer in the world LMFAOOOOO teehee eksdee",
      direction: "left"
    },
    {
      message: "2: This should be in right",
      direction: "right"
    },
    {
      message: "3: This should be in left again",
      direction: "left"
    },
    {
      message: "4: This should be in left again 69",
      direction: "left"
    },
    {
      message: "5: This should be in right again and is a super long message abra cadabra random words 123456789 teehee woohoo according to all known laws of aviation, a bee should not be able to fly",
      direction: "right"
    },
    {
      message: "6: hopefully the next message will make it easier to test stuff aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis, urna ac luctus rhoncus, sem urna laoreet erat, non pharetra erat mauris ut metus. Praesent sollicitudin, sapien eget pulvinar scelerisque, erat mauris pharetra ante, in ornare velit lacus id mauris. Vestibulum laoreet ante risus, eu tincidunt diam consequat sed. Donec non leo lectus. Cras purus magna, tempor vel sapien sit amet, faucibus auctor arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus ultrices ante vel varius. Nulla facilisi. Fusce ultrices venenatis ante nec egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vulputate enim eget feugiat tempus. Duis suscipit, odio eu placerat elementum, lacus purus facilisis sem, non aliquet ipsum augue sed turpis.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      direction: "right"
    }
  ];

  const [messages, setMessages] = useState(dummyData);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  });

  if (props.name == "") {
    return <div/>;
  }

  const chatBubbles = messages.map((obj, i = 0) => (
    <div className={`${classes.bubbleContainer} ${obj.direction == "left" ? classes.left : classes.right}`} key={i}>
      <div key={i++} className={`${classes.bubble} ${obj.direction == "left" ? classes.other : classes.me}`}>
          <div>{obj.message}</div>
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
        onKeyPress={(e) => handleKeyPress(e, message, messages, setMessages, setMessageSent)}
        InputProps={{
          endAdornment: (
            <Button onClick={(e) => sendMessage(message, messages, setMessages, setMessageSent)}>
              <SendIcon/>
            </Button>
          )
        }}
      />
  </div>;
};

export default MessageBox;
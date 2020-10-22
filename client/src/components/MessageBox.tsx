import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { Button, makeStyles, TextField, IconButton } from "@material-ui/core";
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
import { useParams, useHistory } from "react-router";
import { Messaging } from "../hooks/useMessaging";
import { useAuthState } from "react-firebase-hooks/auth";

const renderChatMessage = (message: ChatMessage, uid: string) => {
  // console.log(uid);
  // console.log(message);
  const key = `${message.createdAt.getTime()}-${message.sender}-${
    message.groupId
  }`;
  return (
    <Message
      key={key}
      direction={message.sender === uid ? "right" : "left"}
      text={message.text}
    />
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
  const useStyles = makeStyles((theme) => ({
    container: {
      width: "100%",
      paddingLeft: "2%",
      height: "69vh",
      overflowY: "hidden",
    },
    messagingContainer: {
      overflowY: "scroll",
      height: props.name ? "75%" : "calc(100% - 65px)",
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

  const classes = useStyles();

  const { groupID } = useParams<any>();
  const history = useHistory();
  const id = props.id ? props.id : groupID;

  const x = Messaging.useContainer();

  useEffect(() => {
    x.setGroupId(id);
  }, [id]);

  // current message being typed in text box.
  const [messageInput, setMessageInput] = useState("");

  // reference to end of messages, to scroll to bottom on new message.
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  });

  if (!x.groupMessages || !x.username) {
    return <LoadingPage />;
  }

  const sendMessage = (message: string) => {
    if (message === "") {
      return;
    }

    setMessageInput("");
    props.onSentMessage?.();

    x.sendMessage({
      send: message,
      groupId: id,
    });
  };

  return (
    <div className={classes.container}>
      {props.name ? (
        <h1>
          {props.name}{" "}
          <IconButton
            onClick={() => history.push("/study-rooms/video/" + props.id)}
          >
            <VideocamIcon />
          </IconButton>
        </h1>
      ) : (
        <> </>
      )}
      <div className={classes.messagingContainer}>
        {x.groupMessages.map((y) => renderChatMessage(y, x.username!))}
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

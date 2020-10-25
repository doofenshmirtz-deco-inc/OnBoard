import React, {
  useState,
  useLayoutEffect,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { Button, makeStyles, TextField, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import { LoadingPage } from "./LoadingPage";
import ChatMessage from "./ChatMessage";
import Message from "./Message";
import { Contact } from "../modules/StudyRooms/Recents";
import { useParams, useHistory } from "react-router";
import { Messaging } from "../hooks/useMessaging";

const renderChatMessage = (message: ChatMessage, uid: string) => {
  const key = `${message.createdAt.getTime()}-${message.sender}-${
    message.groupId
  }`;
  return (
    <Message
      key={key}
      direction={message.sender === uid ? "right" : "left"}
      text={message.text}
      sender={message.senderName}
      group={message.group}
    />
  );
};

export type MessageBoxProps = {
  uid?: string; // uid of the user currently logged in
  id?: string; // group id of chat.
  name?: string; // name of group
  onSentMessage?: () => any; // to be called when new message is received.
  contacts?: Contact[]; // all the contacts
  setContacts?: Dispatch<SetStateAction<Contact[]>>; // setContacts from parent (recents.tsx)
  group?: boolean; // whether or not the chat being rendered is a group chat
};

// TODO: clear input message when changing contact
const MessageBox = (props: MessageBoxProps) => {
  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      paddingLeft: "2%",
      height: "69vh",
      overflowY: "hidden",
      display: "inline-block",
      float: "left",
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
    Container: {
      width: "100%",
      display: "flex",
    },
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
  }));

  const classes = useStyles();

  const { groupID } = useParams<any>();
  const history = useHistory();
  const id = props.id ? props.id : groupID;

  const msgBox = Messaging.useContainer();

  useEffect(() => {
    msgBox.setGroupId(id);
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

  if (!msgBox.groupMessages || !msgBox.username) {
    return <LoadingPage />;
  }

  const sendMessage = (message: string) => {
    if (message === "") {
      return;
    }

    setMessageInput("");
    props.onSentMessage?.();

    msgBox.sendMessage({
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
          {/* <IconButton
            style={{position: "absolute", right: "2em", top: "9em"}}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <InfoIcon />
          </IconButton> */}
        </h1>
      ) : (
        <> </>
      )}
      <div className={classes.messagingContainer}>
        {msgBox.groupMessages.map((y) =>
          renderChatMessage(y, msgBox.username!)
        )}
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

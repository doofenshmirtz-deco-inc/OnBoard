import React, {
  useState,
  useLayoutEffect,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import {
  Button,
  makeStyles,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VideocamIcon from "@material-ui/icons/Videocam";
import { LoadingPage } from "./LoadingPage";
import ChatMessage from "./ChatMessage";
import Message from "./Message";
import { Contact } from "../modules/StudyRooms/Recents";
import { useParams, useHistory } from "react-router";
import { Messaging } from "../hooks/useMessaging";
import GroupIcon from "@material-ui/icons/Group";
import { TextToLinks } from "../utils/string";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { DropzoneArea } from "material-ui-dropzone";
import { gql, useMutation } from "@apollo/client";
import { MessageUpload } from "../graphql/MessageUpload";

const UPLOAD_FILE = gql`
  mutation MessageUpload($file: Upload!) {
    singleUpload(file: $file)
  }
`;

const renderChatMessage = (message: ChatMessage, uid: string) => {
  const key = `${message.createdAt.getTime()}-${message.sender}-${
    message.groupId
  }`;
  return (
    <Message
      key={key}
      direction={message.sender === uid ? "right" : "left"}
      text={TextToLinks(message.text, "#0B3954")}
      sender={message.senderName}
      group={message.group}
      time={message.createdAt.toLocaleString('en-GB')}
    />
  );
};

type FileUploadProps = {
  open: boolean; // whether the dialog box is open or closed
  handleClose: () => any; // handle the closing of the dialog box
  sendMessage: (url: string) => any; // sets the file upload message to send
};

const FileUpload = (props: FileUploadProps) => {
  const useStyles = makeStyles((theme) => ({
    dropzone: {
      width: "75%",
      margin: "0 auto 10%",
    },
    bold: {
      fontWeight: 500,
    },
    grey: {
      color: "#c9c9c9",
    },
    sendBtn: {
      margin: "0 auto 5%",
    },
    noTextTransform: {
      textTransform: "none",
    },
  }));

  const classes = useStyles();

  // get the mutation in order to upload the files
  const [upload, { data }] = useMutation<MessageUpload>(UPLOAD_FILE);

  // the url where the file is located
  const url = data?.singleUpload;

  // upload the file to the server
  const uploadCallback = (files: File[]) => {
    const file = files[0];
    if (file) upload({ variables: { file } });
  };

  // send the file to the chat as a link and close the dialog box
  const sendFile = () => {
    if (url) {
      // if you are testing locally, change the URL below to http://localhost:3000
      props.sendMessage("https://onboard.doofenshmirtz.xyz" + url);
      props.handleClose();
    }
    props.handleClose();
  }

  return (
    <Dialog
      onClose={props.handleClose}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="simple-dialog-title">Upload a File</DialogTitle>
      <div className={classes.dropzone}>
        <DropzoneArea
          classes={{ icon: classes.grey }}
          dropzoneParagraphClass={classes.grey}
          filesLimit={1}
          maxFileSize={52428800}
          onChange={(files) => uploadCallback(files)}
        />
      </div>
      <div className={classes.sendBtn}>
        <Button
          variant="contained"
          color="primary"
          className={classes.noTextTransform}
          onClick={sendFile}
        >
          Send
        </Button>
      </div>
    </Dialog>
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
  collapseMembers?: boolean; // whether or not the members list next to the message box should be collapsed
  setCollapse?: any; // to set the value of collapseMembers
  full?: boolean; // whether or not the messagebox should take up the full width or 75% of the width
};

// TODO: clear input message when changing contact
const MessageBox = (props: MessageBoxProps) => {
  const useStyles = makeStyles((theme) => ({
    container: {
      paddingLeft: "2%",
      height: "69vh",
      overflowY: "hidden",
      display: "inline-block",
      float: "left",
    },
    less: {
      width: "75%",
    },
    full: {
      width: "100%",
    },
    messagingContainer: {
      overflowY: "scroll",
      height: props.name ? "75%" : "calc(100% - 65px)",
    },
    sendBar: {
      width: "100%",
      verticalAlign: "middle",
      position: "relative",
      bottom: "1px",
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
    noPadding: {
      padding: 0,
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
  // determine whether the dialog box for file upload should be opened or not
  const [open, setOpen] = useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={`${classes.container} ${
        props.collapseMembers || props.full ? classes.full : classes.less
      }`}
    >
      {props.name ? (
        <h1>
          {props.name}{" "}
          <IconButton
            onClick={() => history.push("/study-rooms/video/" + props.id)}
          >
            <VideocamIcon />
          </IconButton>
          <IconButton onClick={() => props.setCollapse(!props.collapseMembers)}>
            <GroupIcon />
          </IconButton>
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
      <FileUpload open={open} handleClose={handleClose} sendMessage={sendMessage} />
      <TextField
        className={classes.sendBar}
        style={{ marginTop: "10px" }}
        variant="outlined"
        id="message-send"
        label="Send message"
        value={messageInput}
        multiline
        onChange={(e) => {
          setMessageInput(e.target.value)}
        }
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            if (!e.shiftKey) {
              sendMessage(messageInput.trim());
            } else {
              setMessageInput(messageInput + "\n");
            }
          }
        }}
        InputProps={{
          classes: {
            adornedEnd: classes.noPadding,
          },
          startAdornment: (
            <IconButton onClick={handleClickOpen}>
              <AttachFileIcon />
            </IconButton>
          ),
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

import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
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
  senderName: {
    fontSize: "0.6rem",
    color: "rgba(0, 0, 0, 0.4)",
  },
}));

export type MessageProps = {
  direction: "left" | "right";
  text: string;
  sender: string;
};

const Message = (props: MessageProps) => {
  const classes = useStyles();

  return (
    <div>
      <span className={`${classes.senderName}`}>
        {props.direction === "left" ? props.sender : ""}
      </span>
      <div
        className={`${classes.bubbleContainer} ${
          props.direction === "left" ? classes.left : classes.right
        }`}
      >
        <div
          className={`${classes.bubble} ${
            props.direction === "left" ? classes.other : classes.me
          }`}
        >
          <div>{props.text}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;

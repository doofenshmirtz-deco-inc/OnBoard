import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  bubbleContainer: {
    width: "100%",
    display: "flex",
    color:theme.palette.primary.contrastText
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
    backgroundColor: theme.palette.primary.main,
  },
  other: {
    backgroundColor: theme.palette.secondary.main,
    color: "black"
  },
}));

export type MessageProps = {
  direction: "left" | "right";
  text: string;
};

const Message = (props: MessageProps) => {
  const classes = useStyles();

  return (
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
  );
};

export default Message;

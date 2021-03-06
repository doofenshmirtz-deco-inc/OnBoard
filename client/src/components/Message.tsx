/**
 * Message bubble component. Renders a chat message with different styles
 * depending on the sender (e.g. colour, position).
 */

import { makeStyles } from "@material-ui/core";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  bubbleContainer: {
    width: "100%",
    display: "flex",
  },
  bubble: {
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
    borderRadius: "18px 18px 7px 18px",
  },
  other: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "18px 18px 18px 7px",
  },
  senderName: {
    fontSize: "0.6rem",
    color: "rgba(0, 0, 0, 0.4)",
  },
  wrapText: {
    overflowWrap: "break-word",
  },
}));

export type MessageProps = {
  direction: "left" | "right";
  text: (string | JSX.Element)[];
  sender: string;
  group?: boolean;
  time: string;
};

const Message = (props: MessageProps) => {
  const classes = useStyles();

  // FIXME: is this kinda dodgy????
  // insert new lines if the user used shift+enter when sending a message
  let message = props.text;
  if (message.length === 1 && typeof message[0] === "string") {
    const split = message[0].split("\n").filter((line: string) => line !== "");
    message = split.map((line: string, i: number) =>
      i == split.length - 1 ? (
        <span>{line}</span>
      ) : (
        <span>
          {line}
          <br />
        </span>
      )
    );
  }

  return (
    <div>
      <span className={`${classes.senderName}`}>
        {props.direction === "left" && props.group ? props.sender : ""}
      </span>
      <div
        className={`${classes.bubbleContainer} ${
          props.direction === "left" ? classes.left : classes.right
        }`}
      >
        <Tooltip
          arrow
          title={props.time}
          placement={props.direction === "left" ? "right" : "left"}
        >
          <div
            className={`${classes.bubble} ${
              props.direction === "left" ? classes.other : classes.me
            }`}
            data-cy="message"
          >
            <div className={classes.wrapText}>{message}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Message;

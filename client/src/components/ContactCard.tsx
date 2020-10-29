/**
 * Contact card, used for contacts list and recent groups list. Renders one
 * avatar for single user and two avatars for multiple users.
 */

import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

import { red } from "@material-ui/core/colors";
import MessageIcon from "@material-ui/icons/Message";
import CallIcon from "@material-ui/icons/Call";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: red[500],
    },
    noBorder: {
      border: "none",
    },
    cardBackground: {
      backgroundColor: "transparent",
      borderRadius: "0px",
      shadows: "none",
    },
    // TODO: change this so that it's maybe something different for new messages, idk, testing might help with this
    newMessage: {
      fontWeight: "bold",
      backgroundColor: theme.palette.secondary.main,
    },
    read: {
      fontWeight: "normal",
      backgroundColor: "transparent",
    },
  })
);

type ContactCardProps = {
  buttonsOff: boolean; // whether to display call buttons.
  contact: any;
  contact2?: any;
  readStatus: boolean; // read status, true if read.
  name: string; // group or contact name
  group?: boolean; // whether this is a group
};

export default function ContactCard(props: ContactCardProps) {
  const classes = useStyles();
  let buttons, action;

  if (!props.buttonsOff) {
    buttons = (
      <CardActions>
        <IconButton aria-label="call">
          <CallIcon />
        </IconButton>
        <IconButton aria-label="message">
          <MessageIcon />
        </IconButton>
      </CardActions>
    );
  }

  const avatar = (
    <AvatarGroup className={classes.noBorder} max={3}>
      <Avatar
        className={classes.noBorder}
        aria-label="contact"
        alt={props.contact.name}
        src={props.contact.avatar}
      />
      {props.group ? (
        <Avatar
          className={classes.noBorder}
          aria-label="contact"
          alt={props.contact2.name}
          src={props.contact2.avatar}
        />
      ) : null}
    </AvatarGroup>
  );

  return (
    <Card className={classes.cardBackground}>
      <CardHeader
        className={props.readStatus ? classes.read : classes.newMessage}
        avatar={avatar}
        action={action}
        title={props.name}
        subheader={props.contact.role}
      />
      {buttons}
    </Card>
  );
}

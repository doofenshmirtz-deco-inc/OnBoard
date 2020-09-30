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
    },
  })
);

export default function ContactCard(props: any) {
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
    <AvatarGroup max={2}>
      <Avatar
        aria-label="contact"
        alt={props.contact.name}
        src={props.contact.avatar}
      />
      {props.group ? (
        <Avatar
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
        avatar={avatar}
        action={action}
        title={props.name}
        subheader={props.contact.role}
      />
      {buttons}
    </Card>
  );
}

import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import { red } from "@material-ui/core/colors";
import MessageIcon from "@material-ui/icons/Message";
import CallIcon from "@material-ui/icons/Call";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: red[500],
    },
    cardBackground: {
      backgroundColor: "transparent"
    }
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
    )
  } 

  return (
    <Card className={classes.cardBackground}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="contact"
              className={classes.avatar}
              src={props.contact.avatar}
            >
              {props.contact.name[0]}
            </Avatar>
          }
          action={action}
          title={props.contact.name}
          subheader={props.contact.role}
        />
      {buttons}
    </Card>
  );
}

import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { red } from "@material-ui/core/colors";
import MessageIcon from "@material-ui/icons/Message";
import CallIcon from "@material-ui/icons/Call";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export default function ContactCard(props: any) {
  const classes = useStyles();

  return (
    <Card>
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
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.contact.name}
        subheader={props.contact.role}
      />
      <CardActions>
        <IconButton aria-label="call">
          <CallIcon />
        </IconButton>
        <IconButton aria-label="message">
          <MessageIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
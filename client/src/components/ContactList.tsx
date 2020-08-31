import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import MessageIcon from "@material-ui/icons/Message";
import CallIcon from "@material-ui/icons/Call";

let contacts: string[] = [
  "Phineas Flynn",
  "Ferb Fletcher",
  "Candace Flynn",
  "Perry the Platypus",
  "Heinz Doofenshmirtz",
  "Isabella Garcia-Shapiro",
  "Baljeet Tjinder",
  "Buford van Stomm",
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    searchbar: {},
  })
);

export default function ContactList() {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={classes.root}>
      <h2>Contacts</h2>
      <TextField
        className={classes.searchbar}
        id="contacts-search"
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {contacts.map((item, index) =>
          item.toLowerCase().includes(searchTerm.toLowerCase()) ? (
            <ListItem button key={index}>
              <ListItemText primary={item} key={item} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="call">
                  <CallIcon />
                </IconButton>
                <IconButton edge="end" aria-label="message">
                  <MessageIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ) : null
        )}
      </List>
    </div>
  );
}

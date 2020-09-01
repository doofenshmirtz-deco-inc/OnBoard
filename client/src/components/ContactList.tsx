import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ContactCard from "./ContactCard";

import Popover from "@material-ui/core/Popover";

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
    title: {
      textAlign: "center",
    },
    searchBar: {},
    contactList: {
      overflowY: "auto",
      maxHeight: 300,
    },
  })
);

export default function ContactList() {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>Contacts</h2>
      <TextField
        className={classes.searchBar}
        id="contacts-search"
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List className={classes.contactList}>
        {contacts.map((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase()) ? (
            <ListItem button onClick={handleClick}>
              <ListItemText primary={item} />
            </ListItem>
          ) : null
        )}
      </List>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ContactCard />
      </Popover>
    </div>
  );
}

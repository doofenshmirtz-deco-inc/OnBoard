import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import ContactCard from "./ContactCard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Popover from "@material-ui/core/Popover";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

import contacts from "./Contacts.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 400,
      marginBottom: "2rem",
    },
    title: {},
    searchBar: {
      width: "200",
      margin: "auto",
    },
    contactList: {
      overflowY: "auto",
      height: 262,
    },
  })
);

export default function ContactList() {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    contactObj: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contactObj);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box border={1} className={classes.root}>
      <Container>
        <h2 className={classes.title}>Contacts</h2>
        <TextField
          className={classes.searchBar}
          id="contacts-search"
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List className={classes.contactList}>
          {Object.values(contacts).map((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
              <ListItem button onClick={(e) => handleClick(e, item)}>
                <ListItemText primary={item.name} />
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
          <ContactCard contact={selectedContact} />
        </Popover>
      </Container>
    </Box>
  );
}

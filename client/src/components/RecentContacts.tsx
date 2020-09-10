import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from '@material-ui/core/styles';
import contacts from "../components/Contacts.json";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";

const RecentContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      width: "25%"
    },
    searchBar: {
      width: "75%",
      margin: "auto",
    }
  }));
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <TextField
        className={classes.searchBar}
        id="contacts-search"
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {Object.values(contacts).map((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <ContactCard contact={item} buttonsOff={true}/>
        ) : null
      )}
    </List>
  );
};

export default RecentContacts;
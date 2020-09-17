import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from '@material-ui/core/styles';
import contacts from "../components/Contacts.json";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import MessageBox from "./MessageBox";
import ListItem from "@material-ui/core/ListItem";

const RecentContacts = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      width: "25%"
    },
    contact: {
      display: "initial", 
      textTransform: "none", 
      textAlign: "left", 
      padding: "0"
    },
    searchBar: {
      width: "75%",
      margin: "auto",
    },
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
      {Object.values(contacts).map((item, i) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <Button 
            color="primary" 
            disableElevation
            style={{}}
            onClick={(e) => {props.handleClick(item)}}
            className={classes.contact}
          > 
            <ContactCard key={i} contact={item} buttonsOff={true}/>
          </Button>
        ) : null
      )}
    </List>
    
  );
};

export default RecentContacts;
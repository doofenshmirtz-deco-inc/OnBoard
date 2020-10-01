import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

const RecentContacts = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      width: "25%",
      height: "60vh",
      overflowY: "scroll",
      paddingBottom: "0px",
    },
    contact: {
      display: "initial",
      textTransform: "none",
      textAlign: "left",
      padding: "0",
    },
    searchBar: {
      width: "100%",
      margin: "0",
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {Object.values(props.contacts).map((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <Button
            color="primary"
            disableElevation
            style={{
              backgroundColor:
                props.selected.id === item.id ? "#e3e1e1" : "white",
            }}
            onClick={(e) => {
              props.handleClick(item);
            }}
            className={classes.contact}
          >
            <ContactCard
              key={item.id}
              name={item.name}
              contact={item.users[0]}
              buttonsOff={true}
              group={item.group}
              contact2={item.users[1]}
              contacts={item.users}
            />
          </Button>
        ) : null
      )}
    </List>
  );
};

export default RecentContacts;

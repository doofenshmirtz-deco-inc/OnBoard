import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as firebase from "firebase";

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
      paddingLeft: 10,
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
      {Object.values(props.contacts).map((item: any) => {
        const users =
          item.users.length > 1
            ? item.users.filter((u: any) =>
                firebase.auth().currentUser
                  ? u.id !== firebase.auth().currentUser!.email?.split("@")[0]
                  : true
              )
            : item.users;

        return item?.name
          ?.toLowerCase?.()
          .includes?.(searchTerm.toLowerCase()) ? (
          <Button
            key={item.id}
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
              readStatus={item.readStatus}
              contact={users[0]}
              buttonsOff={true}
              group={item.group}
              contact2={users[1]}
              contacts={item.users}
            />
          </Button>
        ) : null;
      })}
    </List>
  );
};

export default RecentContacts;

import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Messaging } from "../hooks/useMessaging";
import CreateRoomBtn from "./CreateRoomBtn";
import * as firebase from "firebase";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { IconButton } from "@material-ui/core";

const RecentContacts = (props: any) => {
  // search for contacts within the contacts list
  const [searchTerm, setSearchTerm] = useState("");
  // whether or not the contacts list should collapse (only to be used when not on dashboard)
  const [collapse, setCollapse] = useState(false);

  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "63vh",
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
      width: "70%",
      margin: "2px 0 0 0",
      paddingLeft: 10,
    },
    hide: {
      display: "none",
    }
  }));

  const classes = useStyles();

  const { contacts: contactsData } = Messaging.useContainer();
  const contacts =
    contactsData?.filter((c: any) => c.__typename === "DMGroup") ?? [];

  return (
    <div className={props.collapsed ? classes.hide : ""}>
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
      <CreateRoomBtn contacts={contacts} handleClick={props.handleClick} />
      <List className={classes.root}>
        {props.contacts.map((item: any) => {
          const users =
            item.users.length > 1
              ? item.users.filter(
                  (u: any) =>
                    u.id !== firebase.auth().currentUser?.email?.split("@")[0]
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
                  props.selected.id === item.id ? "#e3e1e1" : "#fafafa",
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
                group={item.users.length > 2}
                contact2={users[1]}
                contacts={item.users}
              />
            </Button>
          ) : null;
        })}
      </List>
    </div>
  );
};

export default RecentContacts;

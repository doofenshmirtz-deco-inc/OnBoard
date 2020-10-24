import React, { useState } from "react";
import List from "@material-ui/core/List";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ContactCard from "./ContactCard";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { gql, useQuery } from "@apollo/client";
import CreateRoomBtn from "./CreateRoomBtn";
import { ContactsRecents } from "../graphql/ContactsRecents";

const contactsQuery = gql`
  query ContactsRecents {
    me {
      groups {
        ... on DMGroup {
          id
          name
          users {
            id
          }
        }
      }
    }
  }
`;

const RecentContacts = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
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
      width: "70%",
      margin: "0",
      paddingLeft: 10,
    },
  }));

  const classes = useStyles();

  const contactsData = useQuery<ContactsRecents>(contactsQuery);
  const contacts = contactsData.data?.me?.groups.filter(
    (c: any) => c.__typename === "DMGroup"
  );

  return (
    <div>
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
      <CreateRoomBtn contacts={contacts} />
      <List className={classes.root}>
        {Object.values(props.contacts).map((item: any) =>
          item?.name?.toLowerCase?.().includes?.(searchTerm.toLowerCase()) ? (
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
    </div>
  );
};

export default RecentContacts;

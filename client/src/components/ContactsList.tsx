import { Button, List, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import ContactCard from "./ContactCard";

const ContactsList = (props: any) => {
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
      margin: "0",
      paddingLeft: 10,
    },
  }));

  const classes = useStyles();

  return (
    <List className={classes.root}>
        {Object.values(props.contacts).map((item: any) =>
          item?.name?.toLowerCase?.().includes?.(props.searchTerm.toLowerCase()) ? (
            <Button
              key={item.id}
              color="primary"
              disableElevation
              style={{
                backgroundColor:
                  props.selected.id === item.id ? "#e3e1e1" : "#fafafa",
              }}
              onClick={(e) => {
                props.onClick(item);
              }}
              className={classes.contact}
            >
              <ContactCard
                key={item.id}
                name={item.name}
                readStatus={item.readStatus}
                contact={item.users[0]}
                buttonsOff={true}
                group={item.users.length > 2}
                contact2={item.users[1]}
                contacts={item.users}
              />
            </Button>
          ) : null
        )}
      </List>
  );
}

export default ContactsList;
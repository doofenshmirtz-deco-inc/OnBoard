import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Recents from "../modules/StudyRooms/Recents";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    title: {},
    searchBar: {
      width: "100%",
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

  return (
    <Box border={1} className={classes.root}>
      <Container>
        <h2 className={classes.title}>Contacts</h2>
        <Recents />
      </Container>
    </Box>
  );
}

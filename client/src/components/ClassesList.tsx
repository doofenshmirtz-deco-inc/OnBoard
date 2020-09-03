import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

class Course {
  name: string;
  colour: string;

  constructor(name: string, colour: string) {
    this.name = name;
    this.colour = colour;
  }
}

let classList: Course[] = [
  new Course("COSC3500", "#FF5A5F"),
  new Course("COMP4500", "#DBAD6A "),
  new Course("DECO3801", "#087E8B"),
  new Course("STAT2203", "#751CCE"),
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    searchbar: {},
  })
);

export default function ContactList() {
  const classes = useStyles();

  return (
    <Box border={1} className={classes.root}>
      <Container>
        <h2>Classes</h2>
        <List>
          {classList.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon>
                <svg width={20} height={20}>
                  <circle cx={10} cy={10} r={10} fill={item.colour}></circle>
                </svg>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}

import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useQuery, gql } from "@apollo/client";
import { MyClasses } from "../graphql/MyClasses";
import { Link } from "react-router-dom";

class Course {
  name: string;
  colour: string;

  constructor(name: string, colour: string) {
    this.name = name;
    this.colour = colour;
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
    },
  })
);

const GET_CLASSES = gql`
  query MyClasses {
    me {
      courses {
        colour
        course {
          name
          code
          id
        }
      }
    }
  }
`;

export default function ContactList() {
  const classes = useStyles();

  const { loading, error, data } = useQuery<MyClasses>(GET_CLASSES);

  const classListElem =
    !data || !data.me ? (
      <div></div>
    ) : (
      <List>
        {data.me.courses.map((item: any, index: number) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={"/classes/" + item.course.id}
          >
            <ListItemIcon>
              <svg width={20} height={20}>
                <circle cx={10} cy={10} r={10} fill={item.colour}></circle>
              </svg>
            </ListItemIcon>
            <ListItemText
              primary={`${item.course.code}: ${item.course.name}`}
            />
          </ListItem>
        ))}
      </List>
    );

  return (
    <Box border={1} className={classes.root}>
      <Container>
        <h2>Classes</h2>
        {classListElem}
      </Container>
    </Box>
  );
}

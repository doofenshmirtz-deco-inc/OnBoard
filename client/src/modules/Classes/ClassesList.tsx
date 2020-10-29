/**
 * ClassList shows the list of classes that the user is registered in.
 * Used to display the clases on the dashboard and on the empty class route.
 */

import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useQuery, gql } from "@apollo/client";
import { MyClasses } from "../../graphql/MyClasses";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      border: "1px solid lightgrey",
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

export let ClassesSublist = (props: { noTitle?: boolean }) => {
  const { data } = useQuery<MyClasses>(GET_CLASSES);

  return !data || !data.me ? (
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
            primary={
              props.noTitle
                ? item.course.code
                : `${item.course.code}: ${item.course.name}`
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export let ClassesList = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container>
        <h2>Classes</h2>
        <ClassesSublist />
      </Container>
    </Box>
  );
};

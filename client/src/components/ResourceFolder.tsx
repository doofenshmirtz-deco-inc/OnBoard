import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import { useQuery, gql } from "@apollo/client";
import {
  GetRootCoursePage,
  GetRootCoursePage_course_coursePage_children_HeadingNode,
  GetRootCoursePage_course_coursePage_children_FolderNode,
  GetRootCoursePage_course_coursePage_children_TextNode,
} from "../graphql/GetRootCoursePage";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 500,
    },
  })
);

const ROOT_FOLDER = gql`
  query GetRootCoursePage($courseID: ID!) {
    course(courseID: $courseID) {
      id
      coursePage {
        id
        title
        children {
          ... on TextNode {
            id
            title
            text
          }
          ... on HeadingNode {
            id
            title
          }
          ... on FolderNode {
            id
            title
          }
        }
      }
    }
  }
`;

function FolderItem(
  item: GetRootCoursePage_course_coursePage_children_FolderNode
) {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} />
    </ListItem>
  );
}

function DocumentItem() {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <DescriptionIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary="A Document" secondary="Here is the secret plans" />
    </ListItem>
  );
}

function TextItem(item: GetRootCoursePage_course_coursePage_children_TextNode) {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <DescriptionIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} secondary={item.text} />
    </ListItem>
  );
}

function HeadingItem(
  item: GetRootCoursePage_course_coursePage_children_HeadingNode
) {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <DescriptionIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} />
    </ListItem>
  );
}

export default function ResourceFolder(props: { courseId?: string }) {
  const classes = useStyles();

  const { loading, data, error } = useQuery<GetRootCoursePage>(ROOT_FOLDER, {
    variables: { courseID: props.courseId },
  });

  return (
    <List className={classes.root}>
      {loading ? (
        <CircularProgress />
      ) : (
        data?.course.coursePage.children.map((item, index) => {
          if (item.__typename === "TextNode") {
            return TextItem(item);
          } else if (item.__typename === "HeadingNode") {
            return HeadingItem(item);
          } else if (item.__typename === "FolderNode") {
            return FolderItem(item);
          }
        })
      )}
    </List>
  );
}

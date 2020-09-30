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
import { GetNode } from "../graphql/GetNode";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 500,
    },
  })
);

interface NodeProps {
  nodeId: any;
}

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

const GET_NODE = gql`
  query GetNode($nodeID: Float!) {
    node(id: $nodeID) {
      ... on TextNode {
        id
        title
        text
        parent {
          id
        }
      }
      ... on HeadingNode {
        id
        title
        parent {
          id
        }
      }
      ... on FolderNode {
        id
        title
        parent {
          id
        }
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
`

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

function RootDirectory(props: {courseId?: string}) {
  const { loading, data, error } = useQuery<GetRootCoursePage>(ROOT_FOLDER, {
    variables: { courseID: props.courseId },
  });

  return (
    <>
    {data?.course.coursePage.children.map((item, index) => {
      if (item.__typename === "TextNode") {
        return TextItem(item);
      } else if (item.__typename === "HeadingNode") {
        return HeadingItem(item);
      } else if (item.__typename === "FolderNode") {
        return FolderItem(item);
      }
    })
  }
    </>
  );
}

// This is so jank it's not funny, figure this out.
function NodeDirectory(props: {courseId?: string, nodeId?: string}) {
  let { nodeId } = useParams<NodeProps>();

  const { loading, data, error } = useQuery<GetNode>(GET_NODE, {
    variables: { nodeID: props.nodeId ? parseInt(props.nodeId) : parseInt(nodeId) },
  });

  if (data?.node?.__typename === "TextNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id}/>}</>;
  } else if (data?.node?.__typename === "HeadingNode") {
    return <>{HeadingItem(data.node)}</>;
  } else if (data?.node?.__typename === "FolderNode") {
    // return <>{FolderItem(data.node)}</>;
    return <>{data?.node?.children.map((item, index) => {
      if (item.__typename === "TextNode") {
        return TextItem(item);
      } else if (item.__typename === "HeadingNode") {
        return HeadingItem(item);
      } else if (item.__typename === "FolderNode") {
        return FolderItem(item);
      }
    })
    }</>
  }
  return <p>Nothing here</p>;
}

export default function ResourceFolder(props: { courseId?: string }) {
  const classes = useStyles();

  let { url } = useRouteMatch();

  return (
    <List className={classes.root}>
      <Switch>
      <Route path={`${url}/:nodeId`}>
        <NodeDirectory {...props}/>
      </Route>
      <Route path="/">
        <RootDirectory {...props}/>
      </Route>
      </Switch>
        
    </List>
  );
}

import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import { useQuery, gql } from "@apollo/client";
import { GetRootCoursePage } from "../graphql/GetRootCoursePage";
import { GetNode } from "../graphql/GetNode";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Route,
  Switch,
  useParams,
  useRouteMatch,
  Link as RouterLink,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

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
          title
        }
      }
      ... on HeadingNode {
        id
        title
        parent {
          id
          title
        }
      }
      ... on FolderNode {
        id
        title
        parent {
          id
          title
          parent {
            id
            title
            parent {
              id
            }
          }
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
`;

function FolderItem(item: any) {
  return (
    <ListItem button component={RouterLink} to={`${item.id}`}>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} />
    </ListItem>
  );
}

function TextItem(item: any) {
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

function HeadingItem(item: any) {
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

function NodeDirectory(props: {
  courseId?: string;
  nodeId?: string;
  colour?: string;
}) {
  const classes = useStyles();
  let { nodeId } = useParams<NodeProps>();

  const { loading, data, error } = useQuery<GetNode>(GET_NODE, {
    variables: {
      nodeID: props.nodeId ? parseInt(props.nodeId) : parseInt(nodeId),
    },
  });

  if (data?.node?.__typename === "TextNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} />}</>;
  } else if (data?.node?.__typename === "HeadingNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} />}</>;
  } else if (data?.node?.__typename === "FolderNode") {
    return (
      <>
        <Breadcrumbs aria-label="breadcrumb">
          {data?.node?.parent?.parent?.parent?.id ? (
            <Link
              color="inherit"
              component={RouterLink}
              to={`${data?.node?.parent?.parent?.parent?.id}`}
            >
              …
            </Link>
          ) : null}
          {data?.node?.parent?.parent?.id ? (
            <Link
              color="inherit"
              component={RouterLink}
              to={`${data?.node?.parent?.parent?.id}`}
            >
              {data?.node?.parent?.parent?.title}
            </Link>
          ) : null}
          {data?.node?.parent?.id ? (
            <Link
              color="inherit"
              component={RouterLink}
              to={`${data?.node?.parent?.id}`}
            >
              {data?.node?.parent?.title}
            </Link>
          ) : null}
          <Typography color="textPrimary">{data?.node?.title}</Typography>
        </Breadcrumbs>
        <List className={classes.root}>
          {data?.node?.children.map((item, index) => {
            if (item.__typename === "TextNode") {
              return TextItem(item);
            } else if (item.__typename === "HeadingNode") {
              return HeadingItem(item);
            } else if (item.__typename === "FolderNode") {
              return FolderItem(item);
            }
          })}
        </List>
      </>
    );
  }
  return <></>;
}

export default function ResourceFolder(props: { courseId?: string }) {
  const classes = useStyles();

  const { loading, data, error } = useQuery<GetRootCoursePage>(ROOT_FOLDER, {
    variables: { courseID: props.courseId },
  });

  let { url } = useRouteMatch();

  return loading ? (
    <LinearProgress />
  ) : (
    <Switch>
      <Route path={`${url}/:nodeId`}>
        <NodeDirectory {...props} />
      </Route>
      <Route path="/">
        <NodeDirectory nodeId={data?.course.coursePage.id} {...props} />
      </Route>
    </Switch>
  );
}

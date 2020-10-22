import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import { useQuery, useMutation, gql } from "@apollo/client";
import { GetRootCoursePage } from "../graphql/GetRootCoursePage";
import { GetRootAssessmentPage } from "../graphql/GetRootAssessmentPage";
import { GetNode } from "../graphql/GetNode";
import { AddTextNode } from "../graphql/AddTextNode";
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
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

interface NodeProps {
  nodeId: any;
}

const ROOT_COURSE_FOLDER = gql`
  query GetRootCoursePage($courseID: ID!) {
    course(courseID: $courseID) {
      id
      coursePage {
        id
      }
    }
  }
`;

const ROOT_ASSESSMENT_FOLDER = gql`
  query GetRootAssessmentPage($courseID: ID!) {
    course(courseID: $courseID) {
      id
      assessmentPage {
        id
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

const ADD_TEXT_NODE = gql`
  mutation AddTextNode($title: String!, $parent: Float!, $text: String!, $link: String!) {
    textNode(data: {title: $title, parent: $parent, text: $text, link: $link}) {
      id
      title
      text
      parent {
        id
      }
      link
    }
  }
`

// const DELETE_NODE = gql`
//   mutation DeleteNode($nodeId: float) {

//   }
// `

function FolderItem(item: any, index: number) {
  return (
    <ListItem button key={index} component={RouterLink} to={`${item.id}`}>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} />
    </ListItem>
  );
}

function TextItem(item: any, index: number) {
  return (
    <ListItem button key={index} component={RouterLink} to={`${item.id}`}>
      <ListItemAvatar>
        <Avatar>
          <DescriptionIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.title} secondary={item.text} />
    </ListItem>
  );
}

function HeadingItem(item: any, index: number) {
  return (
    <ListItem button key={index} component={RouterLink} to={`${item.id}`}>
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
  editable?: boolean;
}) {
  const classes = useStyles();
  let { nodeId } = useParams<NodeProps>();

  const { loading, data, error } = useQuery<GetNode>(GET_NODE, {
    variables: {
      nodeID: props.nodeId ? parseInt(props.nodeId) : parseInt(nodeId),
    },
  });

  if (data?.node?.__typename === "TextNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} {...props}/>}</>;
  } else if (data?.node?.__typename === "HeadingNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} {...props}/>}</>;
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
        {props.editable ? <AddItem /> : null }
        <List className={classes.root}>
          {data?.node?.children.map((item, index) => {
            if (item.__typename === "TextNode") {
              return TextItem(item, index);
            } else if (item.__typename === "HeadingNode") {
              return HeadingItem(item, index);
            } else if (item.__typename === "FolderNode") {
              return FolderItem(item, index);
            }
          })}
        </List>
      </>
    );
  }
  return <></>;
}

function NodeContent(props: { courseId?: string; nodeId?: string, editable?: boolean}) {
  const classes = useStyles();
  let { nodeId } = useParams<NodeProps>();

  const { loading, data, error } = useQuery<GetNode>(GET_NODE, {
    variables: {
      nodeID: props.nodeId ? parseInt(props.nodeId) : parseInt(nodeId),
    },
  });

  if (data?.node?.__typename === "TextNode") {
    return (
      <Paper className={classes.paper}>
        {props.editable ? <DeleteNode /> : null}
        <h1>{data.node?.title}</h1>
        <p>{data.node?.text}</p>
      </Paper>
    );
  }
  
  if (data?.node?.__typename === "FolderNode") {
    return (
      <Paper className={classes.paper}>
        {props.editable ? <DeleteNode /> : null}
        <h1>{data.node?.title}</h1>
        <h3>Folder</h3>
      </Paper>
    );
  }

  return <></>;
}

function AddItem(props: { nodeId?: string }) {
  const [open, setOpen] = React.useState(false);

  const [nodeTitle, setNodeTitle] = React.useState("");
  const [nodeContents, setNodeContents] = React.useState("");
  const [nodeLink, setNodeLink] = React.useState("");

  const [addNode, { data }] = useMutation<AddTextNode>(ADD_TEXT_NODE);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    addNode({ variables : { title: nodeTitle, text: nodeContents, link: nodeLink, parent: props.nodeId }})
    setOpen(false);
  };

  return (
    <div>
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="title"
            label="Title"
            fullWidth
            onChange={(e) => setNodeTitle(e.target.value)}
          />
          <TextField
            id="content"
            label="Content"
            rows={4}
            multiline
            fullWidth
            onChange={(e) => setNodeContents(e.target.value)}
          />
          <TextField
            id="link"
            label="Link"
            fullWidth
            onChange={(e) => setNodeLink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function DeleteNode(props: { nodeId?: string }) {
  const [open, setOpen] = React.useState(false);

  const [deleteNode] = useMutation<AddTextNode>(ADD_TEXT_NODE);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    deleteNode({ variables : { nodeId: props.nodeId }})
    setOpen(false);
  };

  return (
    <div>
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function ResourceFolder(props: {
  courseId?: string;
  assessmentPage: boolean;
}) {
  const classes = useStyles();

  const { data: coursePage, error: courseError } = useQuery<GetRootCoursePage>(
    ROOT_COURSE_FOLDER,
    {
      variables: { courseID: props.courseId },
      skip: props.assessmentPage,
    }
  );

  const { data: assessmentPage, error: assessmentError } = useQuery<
    GetRootAssessmentPage
  >(ROOT_ASSESSMENT_FOLDER, {
    variables: { courseID: props.courseId },
    skip: !props.assessmentPage,
  });

  let nodeId;
  if (props.assessmentPage) {
    nodeId = assessmentPage?.course.assessmentPage.id;
  } else {
    nodeId = coursePage?.course.coursePage.id;
  }

  let { url } = useRouteMatch();

  return !nodeId ? (
    <LinearProgress />
  ) : (
    <div className={classes.root}>
      <Switch>
        <Route path={`${url}/:nodeId`}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <NodeDirectory {...props} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NodeContent {...props} />
            </Grid>
          </Grid>
        </Route>
        <Route path="/">
          <Grid container spacing={3}>
            <Grid item xs={6} sm={6}>
              <NodeDirectory nodeId={nodeId} {...props} />
            </Grid>
            <Grid item xs={6} sm={6}>
              <NodeContent nodeId={nodeId} {...props} />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </div>
  );
}

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
import { EditTextNode } from "../graphql/EditTextNode";
import { EditFolderNode } from "../graphql/EditFolderNode";
import { FileUpload } from "../graphql/FileUpload";
import { DeleteNode } from "../graphql/DeleteNode";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Route,
  Switch,
  useParams,
  useRouteMatch,
  Link as RouterLink,
  useHistory,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { DropzoneArea } from "material-ui-dropzone";
import Tooltip from "@material-ui/core/Tooltip";
import ReactMarkdown from "react-markdown";
import RemoveMD from "remove-markdown";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.primary,
    },
    uploadDropZone: {
      marginTop: "0.5rem",
      color: theme.palette.text.secondary,
    },
    uploadText: {
      color: theme.palette.text.secondary,
      fontSize: "12pt",
    },
    inputTopMargin: {
      marginTop: "0.5rem",
    },
    content: {
      whiteSpace: "pre",
    }
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
        link
        parent {
          id
          title
        }
      }
      ... on HeadingNode {
        id
        title
        link
        parent {
          id
          title
        }
      }
      ... on FolderNode {
        id
        title
        link
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

const EDIT_TEXT_NODE = gql`
  mutation EditTextNode(
    $id: Float
    $title: String
    $link: String
    $parent: Float
    $text: String
  ) {
    editTextNode(
      data: {
        id: $id
        title: $title
        link: $link
        parent: $parent
        text: $text
      }
    ) {
      id
      title
      text
      link
      parent {
        id
        title
      }
    }
  }
`;

const EDIT_FOLDER_NODE = gql`
  mutation EditFolderNode($id: Float, $title: String, $parent: Float) {
    editFolderNode(data: { id: $id, title: $title, parent: $parent }) {
      id
      title
      parent {
        id
        title
      }
    }
  }
`;

const UPLOAD_FILE = gql`
  mutation FileUpload($file: Upload!) {
    singleUpload(file: $file)
  }
`;

const DELETE_NODE = gql`
  mutation DeleteNode($nodeId: Float!) {
    deleteNode(id: $nodeId) {
      link
    }
  }
`;

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
      <ListItemText primary={item.title} secondary={RemoveMD(item.text)} />
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
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} {...props} />}</>;
  } else if (data?.node?.__typename === "HeadingNode") {
    return <>{<NodeDirectory nodeId={data?.node?.parent?.id} {...props} />}</>;
  } else if (data?.node?.__typename === "FolderNode") {
    return (
      <>
        <Grid container justify="space-between">
          <Grid item>
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
          </Grid>
          <Grid item>
            {props.editable ? <AddItem nodeId={data?.node?.id} /> : null}
          </Grid>
        </Grid>
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

function NodeContent(props: {
  courseId?: string;
  nodeId?: string;
  editable?: boolean;
}) {
  const classes = useStyles();
  let { nodeId } = useParams<NodeProps>();

  let checkedNodeId = props.nodeId ? parseInt(props.nodeId) : parseInt(nodeId);

  const { loading, data, error } = useQuery<GetNode>(GET_NODE, {
    variables: {
      nodeID: checkedNodeId,
    },
  });

  let contentText = "";
  let hasChildren = false;
  if (data?.node?.__typename === "TextNode") {
    contentText = data.node.text;
  } else if (data?.node?.__typename === "FolderNode") {
    contentText = "Folder";
    hasChildren = data.node.children.length != 0;
  }

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between">
        <Grid item>
          <h1>{data?.node?.title}</h1>
        </Grid>
        <Grid item>
          {props.editable ? (
            <DeleteItem nodeId={checkedNodeId} hasChildren={hasChildren} />
          ) : null}
        </Grid>
      </Grid>
      <ReactMarkdown className={classes.content}>{contentText}</ReactMarkdown>
      {data?.node?.link && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AttachFileIcon />}
          onClick={() => window.open(data?.node?.link || undefined, "_blank")}
        >
          Open Attachment
        </Button>
      )}
    </Paper>
  );
}

function AddItem(props: { nodeId: string }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [nodeTitle, setNodeTitle] = React.useState("");
  const [nodeContents, setNodeContents] = React.useState("");
  const [nodeType, setNodeType] = React.useState("item");
  const [nodeLinkType, setNodeLinkType] = React.useState("none");
  const [nodeLink, setNodeLink] = React.useState("");
  const [nodeFile, setNodeFile] = React.useState<File[]>();

  const [addTextNode] = useMutation<EditTextNode>(EDIT_TEXT_NODE, {
    update(cache) {
      cache.reset();
    },
  });
  const [addFolderNode] = useMutation<EditFolderNode>(EDIT_FOLDER_NODE, {
    update(cache) {
      cache.reset();
    },
  });
  const [uploadFile] = useMutation<FileUpload>(UPLOAD_FILE, {
    onCompleted(data) {
      addTextNode({
        variables: {
          title: nodeTitle,
          text: nodeContents,
          link: data.singleUpload,
          parent: parseInt(props.nodeId),
        },
      });
    },
  });

  const addLink = (e: string) => {
    if (e.startsWith("http")) {
      setNodeLink(e);
    } else {
      setNodeLink("http://" + e);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (nodeLinkType === "file" && nodeFile && nodeFile[0]) {
      let file = nodeFile[0];

      uploadFile({ variables: { file } });
    } else {
      if (nodeType === "item") {
        addTextNode({
          variables: {
            title: nodeTitle,
            text: nodeContents,
            parent: parseInt(props.nodeId),
            link: nodeLinkType === "link" ? nodeLink : null,
          },
        });
      } else {
        addFolderNode({
          variables: {
            title: nodeTitle,
            parent: parseInt(props.nodeId),
          },
        });
      }
    }

    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add {nodeType}</DialogTitle>
        <DialogContent>
          <Select
            id="typeSelect"
            label="Type"
            value={nodeType}
            fullWidth
            onChange={(e: any) => setNodeType(e.target.value)}
          >
            <MenuItem value={"item"}>Item</MenuItem>
            <MenuItem value={"folder"}>Folder</MenuItem>
          </Select>
          <TextField
            autoFocus
            id="title"
            label="Title"
            fullWidth
            onChange={(e) => setNodeTitle(e.target.value)}
          />
          {nodeType === "item" && (
            <>
              <TextField
                id="content"
                label="Content"
                rows={4}
                multiline
                fullWidth
                onChange={(e) => setNodeContents(e.target.value)}
              />
              <Select
                className={classes.inputTopMargin}
                id="linkTypeSelect"
                label="Attachment Type"
                value={nodeLinkType}
                fullWidth
                onChange={(e: any) => setNodeLinkType(e.target.value)}
              >
                <MenuItem value={"none"}>No Attachment</MenuItem>
                <MenuItem value={"file"}>File Attachment</MenuItem>
                <MenuItem value={"link"}>Website Link</MenuItem>
              </Select>
              {nodeLinkType === "file" && (
                <DropzoneArea
                  classes={{ icon: classes.uploadText }}
                  dropzoneClass={classes.uploadDropZone}
                  dropzoneParagraphClass={classes.uploadText}
                  filesLimit={1}
                  maxFileSize={52428800}
                  onChange={(files) => setNodeFile(files)}
                />
              )}
              {nodeLinkType === "link" && (
                <TextField
                  id="linkInput"
                  label="Website Link"
                  fullWidth
                  onChange={(e) => addLink(e.target.value)}
                />
              )}
            </>
          )}
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

function DeleteItem(props: { nodeId: number; hasChildren: boolean }) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const [deleteNode] = useMutation<DeleteNode>(DELETE_NODE, {
    update(cache) {
      cache.reset();
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    deleteNode({ variables: { nodeId: props.nodeId } });
    history.goBack();
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={props.hasChildren ? "Foler contains items" : "Delete"}>
        <span>
          <IconButton
            disabled={props.hasChildren}
            aria-label="delete"
            onClick={handleClickOpen}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
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
            <Grid item xs={12} sm={6}>
              <NodeDirectory nodeId={nodeId} {...props} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NodeContent nodeId={nodeId} {...props} />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </div>
  );
}

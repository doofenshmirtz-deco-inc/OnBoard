/**
 * Announcements component to render announcements with colours and markdown.
 * This is reused for both the dashboard and individual course pages.
 */

import React from "react";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { TextToLinks } from "../utils/string";
import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { MyAnnouncements } from "../graphql/MyAnnouncements";
import ReactMarkdown from "react-markdown";
import RemoveMD from "remove-markdown";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { deleteAnnouncement } from "../graphql/deleteAnnouncement";
import { useHistory } from "react-router";

const sharedStyles = makeStyles((theme: Theme) =>
  createStyles({
    enrolledClass: {
      backgroundColor: "transparent",
      // height: 300, // Subject to change
      minWidth: 250,
      // boxShadow: "1px 1px 1px 1px #ccc",
      borderRadius: "0px",
      overflow: "hidden",
      marginBottom: "10px",
      border: "1px solid lightgrey",
      borderBottom: "1px solid lightgrey",
      borderRight: "1px solid lightgrey",
    },
    enrolledDashClass: {
      // height: 300, // Subject to change
      minWidth: 250,
      // border: "1px solid black",
    },
    classBody: {
      alignSelf: "stretch",
      whiteSpace: "pre",
      // padding: theme.spacing(2),
    },
    heading: {
      textAlign: "center",
    },
    date: {
      // position: "absolute",
      // top: 0,
      // right: 10,
      fontSize: "0.75rem",
      color: "grey",
      textAlign: "right",
      // padding: 0,
      // margin: 0,
    },
    classItemMargin: {
      marginLeft: "5px",
      marginRight: "5px",
    },
  })
);

const dashboardStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.paper,
      overflow: "hidden",
      border: "1px solid lightgrey",
      height: "100%",
      display: "flex",
      flexFlow: "column",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    classList: {
      overflow: "auto",
      display: "flex",
      width: "100%",
      maxWidth: `calc(100vw - ${100}px)`,
      flex: 1,
      alignItems: "stretch",
    },
  })
);

const notDashboardStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.paper,
      height: "100%",
      marginBottom: "3px",
    },
    classList: {
      // overflow: "auto",
      display: "flex",
      flexFlow: "column",
      width: "100%",
      // maxWidth: `calc(100vw - ${100}px)`,
      // flex: 1,
      //alignItems: "strech",
    },
  })
);

type Announcement = {
  announcement: { id: number; title: string; createdAt: Date; html: string };
  colour: string;
  courseID: string;
};

// character limit on dashboard.
const CHARACTER_LIMIT: number = 225;

// gets description text for the announcement. if is dashboard, truncates to
// the CHARACTER_LIMIT.
const getDescription = (announcement: Announcement, isDashboard: boolean) => {
  let text;
  if (
    announcement.announcement.html.length <= CHARACTER_LIMIT ||
    !isDashboard
  ) {
    text = announcement.announcement.html;
  } else {
    // Trim to 225 chars and add... at the end for the funny
    text = announcement.announcement.html.substring(0, CHARACTER_LIMIT) + "...";
  }

  return isDashboard ? (
    <span>{TextToLinks(RemoveMD(text), announcement.colour)}</span>
  ) : (
    <ReactMarkdown>{text}</ReactMarkdown>
  );
};

/* Render a single announcement button. */
const renderAnnouncement = (
  announcement: Announcement,
  classes: any, // shared styles from parent component.
  key: number,
  isDashboard: boolean,
  deletable?: boolean,
  history?: any
) => {
  let trimmeDesc = getDescription(announcement, isDashboard);
  return (
    <ListItem
      button={isDashboard as true}
      className={clsx(classes.enrolledClass, {
        [classes.classItemMargin]: isDashboard,
      })}
      key={key}
      onClick={() =>
        history.push(`/classes/${announcement.courseID}/annoucements`)
      }
      style={{
        borderLeft: `5px solid ${announcement.colour}`,
        fontWeight: "bolder",
        fontSize: "1.1rem",
        // borderTop: key != 0 && !isDashboard ? 0 : undefined,
      }}
    >
      <ListItemText
        className={classes.classBody}
        primary={
          <Typography variant="inherit">
            <div className={classes.date}>
              {moment(announcement.announcement.createdAt).fromNow()}
            </div>
            {deletable && (
              <DeleteAnnouncement announceId={announcement.announcement.id} />
            )}
            <br />
            {announcement.announcement.title}
          </Typography>
        }
        secondary={trimmeDesc}
      />
    </ListItem>
  );
};

// component for deleting an announcement. shows a button and pops up a
// confirmation query.
function DeleteAnnouncement(props: { announceId: number }) {
  const [open, setOpen] = React.useState(false);

  const [deleteAnnouncement] = useMutation<deleteAnnouncement>(
    DELETE_ANNOUNCEMENT,
    {
      update(cache) {
        cache.reset();
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    deleteAnnouncement({ variables: { id: props.announceId } });
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Delete Announcement">
        <IconButton
          edge="end"
          style={{ marginTop: "-2em", marginLeft: "-0.5em" }}
          aria-label="delete"
          onClick={handleConfirm}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement?
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

const GET_ANNOUNCEMENTS = gql`
  query MyAnnouncements {
    me {
      courses {
        colour
        course {
          id
          announcements {
            id
            createdAt
            html
            title
          }
        }
      }
    }
  }
`;

const DELETE_ANNOUNCEMENT = gql`
  mutation deleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id) {
      id
    }
  }
`;

export default (props: {
  isDashboard: boolean;
  courseId?: string;
  deletable?: boolean;
}) => {
  const classesShared = sharedStyles();
  const classes = props.isDashboard ? dashboardStyles() : notDashboardStyles();
  const { loading, error, data } = useQuery<MyAnnouncements>(GET_ANNOUNCEMENTS);

  const history = useHistory();

  let announcements = data?.me?.courses
    .filter((element) => !props.courseId || element.course.id == props.courseId)
    .map((item) => {
      return item.course.announcements?.map((announcement) => {
        return {
          announcement,
          colour: item.colour,
          courseID: item.course.id,
        };
      });
    })
    .flat(1)
    .sort((a, b) =>
      a.announcement.createdAt < b.announcement.createdAt ? 1 : -1
    );

  const announcementsList = !data ? (
    <div></div>
  ) : (
    <List className={classes.classList}>
      {announcements?.map((item, index) =>
        renderAnnouncement(
          item,
          classesShared,
          index,
          props.isDashboard,
          props.deletable,
          history
        )
      )}
    </List>
  );

  return (
    <div className={classes.root}>
      {props.isDashboard ? <h2>Announcements</h2> : ""}
      {announcementsList}
    </div>
  );
};

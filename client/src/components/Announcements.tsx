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

const sharedStyles = makeStyles((theme: Theme) =>
  createStyles({
    enrolledClass: {
      // height: 300, // Subject to change
      minWidth: 250,
      border: "1px solid black",
      overflow: "hidden",
    },
    enrolledDashClass: {
      // height: 300, // Subject to change
      minWidth: 250,
      border: "1px solid black",
    },
    classBody: {
      alignSelf: "stretch",
    },
    heading: {
      textAlign: "center",
    },
    date: {
      position: "absolute",
      top: 0,
      right: 10,
      fontSize: "0.75rem",
      color: "grey",
      padding: 0,
      margin: 0,
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
      backgroundColor: theme.palette.background.paper,
      overflow: "hidden",
      border: "1px solid black",
      height: "100%",
      display: "flex",
      flexFlow: "column",
      padding: theme.spacing(2),
    },
    classList: {
      overflow: "auto",
      display: "flex",
      width: "100%",
      maxWidth: `calc(100vw - ${100}px)`,
      flex: 1,
      alignItems: "strech",
    },
  })
);

const notDashboardStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.paper,
      height: "100%",
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

const CHARACTER_LIMIT: number = 225;

const getDescription = (announcement: any, isDashboard: boolean) => {
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

/* Render a single announcement button. Haha any go brr */
const renderAnnouncement = (
  announcement: {
    announcement: { id: number; title: string; createdAt: Date; html: string };
    colour: string;
  },
  classes: any,
  key: number,
  isDashboard: boolean,
  deletable?: boolean
) => {
  let trimmeDesc = getDescription(announcement, isDashboard);
  return (
    <ListItem
      button
      className={clsx(classes.enrolledClass, {
        [classes.classItemMargin]: isDashboard,
      })}
      key={key}
      style={{
        borderLeft: `5px solid ${announcement.colour}`,
        fontWeight: "bolder",
        fontSize: "1.1rem",
        borderTop: key != 0 && !isDashboard ? 0 : undefined,
      }}
    >
      <ListItemText
        className={classes.classBody}
        primary={
          <Typography variant="inherit">
            <div className={classes.date}>
              {moment(announcement.announcement.createdAt).fromNow()}
            </div>
            <br />
            {announcement.announcement.title} - {announcement.announcement.id}
          </Typography>
        }
        // disableTypography={true} // for later maybe idk
        secondary={trimmeDesc}
      />
      {deletable && (
        <ListItemSecondaryAction>
          <DeleteAnnouncement announceId={announcement.announcement.id} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

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
        <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}>
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

  let announcements = data?.me?.courses
    .filter((element) => !props.courseId || element.course.id == props.courseId)
    .map((item) => {
      return item.course.announcements?.map((announcement) => {
        return {
          announcement,
          colour: item.colour,
        };
      });
    })
    .flat(1)
    .sort((a, b) =>
      a.announcement.createdAt < b.announcement.createdAt ? 1 : -1
    );

  const annoucementsList = !data ? (
    <div></div>
  ) : (
    <List className={classes.classList}>
      {announcements?.map((item, index) =>
        renderAnnouncement(
          item,
          classesShared,
          index,
          props.isDashboard,
          props.deletable
        )
      )}
    </List>
  );

  return (
    <div className={classes.root}>
      {props.isDashboard ? (
        <h2 className={classesShared.heading}>Announcements</h2>
      ) : (
        ""
      )}
      {annoucementsList}
    </div>
  );
};

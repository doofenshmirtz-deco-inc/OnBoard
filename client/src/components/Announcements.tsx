import React from "react";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { TextToLinks } from "../utils/string";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import { MyAnnouncements } from "../graphql/MyAnnouncements";

const sharedStyles = makeStyles((theme: Theme) =>
  createStyles({
    enrolledClass: {
      // height: 300, // Subject to change
      minWidth: 250,
      border: "1px solid black",
      overflow: "hidden",
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
      overflow: "hidden",
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

  return <span>{TextToLinks(text, announcement.colour)}</span>;
};

/* Render a single announcement button. Haha any go brr */
const renderAnnouncement = (
  announcement: {
    announcement: { title: string; createdAt: Date; html: string };
    colour: string;
  },
  classes: any,
  key: number,
  isDashboard: boolean
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
            {announcement.announcement.title}
          </Typography>
        }
        // disableTypography={true} // for later maybe idk
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body1" />
            {trimmeDesc}
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

const GET_ANNOUNCEMENTS = gql`
  query MyAnnouncements {
    me {
      courses {
        colour
        course {
          id
          announcements {
            createdAt
            html
            title
          }
        }
      }
    }
  }
`;

export default (props: { isDashboard: boolean; courseId?: string }) => {
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
        renderAnnouncement(item, classesShared, index, props.isDashboard)
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

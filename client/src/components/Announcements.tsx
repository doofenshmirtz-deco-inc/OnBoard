import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import announcements from "./announcements.json";
import { TextToLinks } from "../utils/string";
import Container from "@material-ui/core/Container";
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      // maxHeight: 400,
      overflow: "hidden",
      border: "1px solid black",
    },
    enrolledClass: {
      // height: 300, // Subject to change
      minWidth: 250,
      border: "1px solid black",
      marginLeft: "5px",
      marginRight: "5px",
      overflow: "hidden",
    },
    classList: {
      overflow: "auto",
      display: "flex",
      width: "100%",
      maxWidth: `calc(100vw - ${100}px)`,
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
  })
);

const CHARACTER_LIMIT: number = 225;

function getDescription(announcementObj: any) {
  let text;
  if (announcementObj.text <= CHARACTER_LIMIT) {
    text = announcementObj.text;
  } else {
    // Trim to 225 chars and add... at the end for the funny
    text = announcementObj["text"].substring(0, CHARACTER_LIMIT) + "...";
  }

  return <span>{TextToLinks(text, announcementObj.colour)}</span>;
}

// TODO: Change for full query or something idk what you want here hahaha
function onClickHandler(link: string) {
  console.log(link);
}

/* Render a single announcement button. Haha any go brr */
const renderAnnouncement = (
  announcementObj: any,
  classes: any,
  key: number
) => {
  let trimmedesc = getDescription(announcementObj);
  return (
    <ListItem
      button
      className={classes.enrolledClass}
      onClick={() => onClickHandler(announcementObj.link)}
      key={key}
      style={{
        borderLeft: `5px solid ${announcementObj.colour}`,
        fontWeight: "bolder",
        fontSize: "1.1rem",
      }}
    >
      <ListItemText
        // Forbidden br tag, I'm going to web dev jail
        primary={
          <Typography variant="inherit">
            <div className={classes.date}>{announcementObj.date}</div>
            <br />
            {announcementObj.title}
          </Typography>
        }
        // disableTypography={true} // for later maybe idk
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body1" />
            {trimmedesc}
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

const GET_ANNOUCEMENTS = gql`
  query {
    me {
      courseColors {
        colour
        course {
          announcements {
            id
            createdAt
            html
          }
        }
      }
    }
  }
`;

export default function Announcements() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ANNOUCEMENTS);

  console.log(error);

	let announcements = [].concat(data.me.courseColors.map(item => {
		...item.course.announcements,
		colour: data.me.courseColors.colour
	}));

  const annoucementsList = !data ? (
    <div></div>
  ) : (
    <List className={classes.classList}>
      {announcements.map((item, index) =>
        renderAnnouncement(item, classes, index)
      )}
    </List>
  );

  return (
    <div className={classes.root}>
      <Container>
        <h2 className={classes.heading}>Announcements</h2>
        {annoucementsList}
      </Container>
    </div>
  );
}

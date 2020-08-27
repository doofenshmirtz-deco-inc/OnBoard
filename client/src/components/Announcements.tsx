import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';
import announcements from "./announcements.json"

interface Props {
  color: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      maxHeight: 400,
      maxWidth: `calc(100% - ${200}px)`,
      overflow: "hidden"
    },
    enrolledClass: {
      height: 300, // Subject to change
      minWidth: 200,
      fontWeight: "bold",
    },
    classList: {
      overflow: "auto",
      display: "flex",
      width: "100%", 
      maxWidth: `calc(100vw - ${100}px)`,
    },
    heading: {
      textAlign: "center",
    }
  })
);


/* Render a single announcement button. Haha any go brr */
function renderAnnouncement(announcementObj: any, classes: any) {
  let trimmedesc = announcementObj.description.substring(0, 250);

  return ( 
    <ListItem button className={classes.enrolledClass} style={{"borderLeft":`3px solid ${announcementObj.colour}`}}>
      <ListItemText primary={announcementObj.title}
      secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
              >
              </Typography>
              {trimmedesc}
            </React.Fragment>
          }
      />
    </ListItem>
  )
}

/* Render all the announcement buttons */
function renderAnnouncements(classes: any) {  
  const renderedAnnouncements: any[] = [];
  for (let announcementObj of Object.values(announcements)) {
    renderedAnnouncements.push(renderAnnouncement(announcementObj, classes));
  }
  return renderedAnnouncements;
}

export default function ContactList() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Announcements</h2>
      <List className={classes.classList}>
          {renderAnnouncements(classes)}
      </List>
    </div>
  );
}

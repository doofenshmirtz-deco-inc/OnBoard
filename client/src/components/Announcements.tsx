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
      overflow: "hidden",
    },
    enrolledClass: {
      height: 300, // Subject to change
      minWidth: 250,
      
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
      fontSize: "0.7rem",
      color: "grey",
    }
  })
);


/* Render a single announcement button. Haha any go brr */
function renderAnnouncement(announcementObj: any, classes: any) {
  let trimmedesc = announcementObj.description.substring(0, 250) + "...";

  return ( 
    <ListItem button className={classes.enrolledClass} 
      style={{
        "borderLeft":`3px solid ${announcementObj.colour}`,
        "fontWeight": "bolder",
        "fontSize": "1.2rem",
      }}>
      <ListItemText 
        // Forbidden br tag, I'm going to web dev jail
        primary={
          <Typography variant="body1">
            <h3 className={classes.date}>{announcementObj.date}</h3>
            <br/> 
            {announcementObj.title}
          </Typography>}
        // disableTypography={true} // for later maybe
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body1"/>
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

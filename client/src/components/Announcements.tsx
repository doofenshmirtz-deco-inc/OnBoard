import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';
import announcements from "./announcements.json"

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
      maxWidth: `calc(100vw - ${100}px)`
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
function renderAnnouncement(announcementObj: any, classes: any, key: number) {
  // Trim to 250 words and add at the end ... for the funny
  let trimmedesc = announcementObj.description.substring(0, 250) + "...";
  return ( 
    <ListItem button className={classes.enrolledClass} 
      key={key}
      style={{
        "borderLeft":`3px solid ${announcementObj.colour}`,
        "fontWeight": "bolder",
        "fontSize": "1.2rem",
      }}>
      <ListItemText 
        // Forbidden br tag, I'm going to web dev jail
        primary={
          <Typography variant="inherit">
            <div className={classes.date}>{announcementObj.date}</div>
            <br/> 
            {announcementObj.title}
          </Typography>}
        // disableTypography={true} // for later maybe idk
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

export default function Announcements() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Announcements</h2>
      <List className={classes.classList}>
        {Object.values(announcements).map((item, index) => (
          renderAnnouncement(item, classes, index)
        ))}
      </List>
    </div>
  );
}

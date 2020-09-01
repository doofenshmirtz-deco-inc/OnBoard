import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      textAlign: "center",
    }
  })
);

export default function CourseList() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
          <h2 className={classes.title}>Courses</h2>
          
      </div>
  )
}

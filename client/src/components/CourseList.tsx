import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
    },
    title: {
    }
  })
);

export default function CourseList() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
          <h2 className={classes.title}>Courses</h2>
      </CardContent>
    </Card>
  )
}

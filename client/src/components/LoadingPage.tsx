import React from "react";
import { makeStyles, CircularProgress, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinnerGrid: {
    margin: theme.spacing(3),
  },
}));

export const LoadingPage = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.spinnerGrid}
    >
      <CircularProgress />
    </Grid>
  );
};

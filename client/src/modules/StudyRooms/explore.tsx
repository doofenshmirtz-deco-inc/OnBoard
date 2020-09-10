import React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';

const Explore = () => {
    const useStyles = makeStyles((theme: Theme) => ({
      root: {
        flexGrow: 3,
        backgroundColor: theme.palette.background.paper,
        display: "flex"
      }
    }));
    const classes = useStyles();

    return (
      <div className={classes.root}>
        Explore I am lazy
      </div>
    );
};

export default Explore;
import React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';

const Classes = () => {
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
        The Classes go here I think maybe I can do the explore page again but change some stuff I have no idea lol
      </div>
    );
};

export default Classes;
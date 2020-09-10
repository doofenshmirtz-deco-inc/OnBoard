import React from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import MessageBox from "../../components/MessageBox"
import RecentContacts from "../../components/RecentContacts";

const Recents = () => {
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
        <RecentContacts/>
        <MessageBox/>
      </div>
    );
};

export default Recents;
import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import Grid from "@material-ui/core/Grid";
import ContactList from "../../components/Contacts";
import { ClassesList } from "../Classes/ClassesList";
import Announcements from "../../components/Announcements";
import Cal from "../../components/Cal";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    fixHeight: {
      height: 400,
    },
  })
);

const Home = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12} md={8}>
        <Cal />
      </Grid>
      <Grid item xs={12} md={4}>
        <ClassesList />
      </Grid>
      <Grid item xs={12} md={8}>
        <Announcements isDashboard />
      </Grid>
      <Grid item xs={12} md={4} className={classes.fixHeight}>
        <ContactList dashboard />
      </Grid>
    </Grid>
  );
};

export default {
  routeProps: {
    path: "/",
    component: Home,
    exact: true,
  },
  name: "Home",
  icon: HomeIcon,
};

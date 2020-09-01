import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import ContactList from "../../components/ContactList";
import Announcements from "../../components/Announcements";
import Cal from "../../components/Cal";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

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
  }),
);

const Home = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={11}>
      <h1>Home</h1>
      </Grid>
      <Grid item xs={3}>
      <ContactList />
      </Grid>
      <Grid item xs={8}>
      <Cal />
      </Grid>
      <Grid item xs={11}>
      <Announcements />
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

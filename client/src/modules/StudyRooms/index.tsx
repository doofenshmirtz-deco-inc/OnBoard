import React from "react";
import ChatIcon from "@material-ui/icons/Chat";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Recents from "./Recents";
import Explore from "./Explore";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router";
import VideoChat from "../../components/VideoChat";
import MessageBox from "../../components/MessageBox";
import { Grid } from "@material-ui/core";

const StudyRooms = () => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    tabs: {
      textTransform: "none",
    },
  }));

  let { url } = useRouteMatch();

  let history = useHistory();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    history.push(newValue);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Study Rooms</h1>
      <Switch>
        <Redirect exact from={`${url}/`} to="/study-rooms/recents" />
        <Route path={`${url}/video/:groupID`}>
          <Grid container>
            <Grid item xs={12} md={9}>
              <VideoChat />
            </Grid>
            <Grid item xs={12} md={3}>
              <MessageBox />
            </Grid>
          </Grid>
        </Route>
        <Route path="/study-rooms/">
          <AppBar position="static">
            <Tabs
              value={
                (history.location.pathname.match(/\/study-rooms\/[a-z]+/) || [
                  "/study-rooms/recents",
                ])[0]
              }
              onChange={handleChange}
              aria-label="simple tabs example"
              variant="fullWidth"
            >
              <Tab
                className={classes.tabs}
                value="/study-rooms/recents"
                label="Recents"
              />
              <Tab
                className={classes.tabs}
                label="Explore"
                value="/study-rooms/explore"
              />
              <Tab
                className={classes.tabs}
                label="Classes"
                value="/study-rooms/classes"
              />
            </Tabs>
          </AppBar>
          <Switch>
            <Route
              path="/study-rooms/recents/:messageID?"
              render={() => <Recents messaging />}
            />
            <Route
              path="/study-rooms/explore"
              render={() => <Explore isExplore />}
            />
            <Route
              path="/study-rooms/classes"
              render={() => <Explore isExplore={false} />}
            />
          </Switch>
        </Route>
      </Switch>
    </div>
  );
};

export default {
  routeProps: {
    path: "/study-rooms",
    component: StudyRooms,
  },
  name: "Study Rooms",
  icon: ChatIcon,
};

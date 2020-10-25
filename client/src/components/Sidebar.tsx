import React from "react";
import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import modules from "../modules";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase";
import { Icon, Avatar, Collapse } from "@material-ui/core";
import { Lock, ExitToApp, ExpandLess, ExpandMore } from "@material-ui/icons";
import { useQuery, gql } from "@apollo/client";
import { Me } from "../graphql/Me";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { ClassesSublist } from "./ClassesList";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gutters: theme.mixins.gutters(),
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      background: theme.palette.primary.main,
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 24,
      color: theme.palette.primary.contrastText,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      overflowX: "hidden", // No scroll bar when opening drawer
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    paper: {
      background: theme.palette.primary.main,
      // color: "#BFD7EA",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    icon: {
      color: theme.palette.primary.contrastText,
    },
    footer: {
      display: "flex",
      marginTop: "auto",
    },
    title: {
      flexGrow: 1,
    },
    userDetails: {
      display: "flex",
      alignItems: "center",
      "& div": {
        marginLeft: 10,
      },
    },
    nested: {
      paddingLeft: theme.spacing(1),
    },
    nestedExp: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const meQuery = gql`
  query Me {
    me {
      name
      avatar
    }
  }
`;

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [classesOpen, setClassestOpen] = React.useState(false);

  const handleClassesOpen = () => {
    setClassestOpen(!classesOpen);
  };

  const handleLogoutOpen = () => {
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  const handleLogout = () => {
    setLogoutOpen(false);
    firebase.auth().signOut();
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { data } = useQuery<Me>(meQuery);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            OnBoard
          </Typography>
          <div className={classes.userDetails}>
            <Typography>{data && data.me ? data.me.name : ""}</Typography>
            <Avatar
              alt="Profile Picture"
              src={data && data.me ? data.me.avatar : ""}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton
            onClick={handleDrawerClose}
            className={classes.menuButton}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <List>
          {modules.map((item) => {
            if (item.name !== "My Classes") {
              return (
                <ListItem
                  button
                  key={item.name}
                  {...{ component: NavLink, to: item.routeProps.path }}
                  classes={{ gutters: clsx(classes.gutters) }}
                >
                  <ListItemIcon className={classes.icon}>
                    {<item.icon />}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              );
            } else {
              return (
                <>
                  <ListItem
                    button
                    onClick={handleClassesOpen}
                    key={item.name}
                    classes={{ gutters: clsx(classes.gutters) }}
                  >
                    <ListItemIcon className={classes.icon}>
                      {<item.icon />}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {classesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={classesOpen}
                    className={open ? classes.nestedExp : classes.nested}
                    timeout="auto"
                    unmountOnExit
                  >
                    <ClassesSublist noTitle />
                  </Collapse>
                </>
              );
            }
          })}
        </List>
        <List className={classes.footer}>
          <ListItem
            button
            key="logout"
            classes={{ gutters: clsx(classes.gutters) }}
            onClick={handleLogoutOpen}
          >
            <ListItemIcon className={classes.icon}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Dialog
        open={logoutOpen}
        onClose={handleLogoutClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  makeStyles,
  Theme,
  createStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";

import modules from "./modules";
import Sidebar from "./components/Sidebar";

import * as firebase from "firebase/app";
import "firebase/auth";
import { Login } from "./modules/Login";
import { LoadingPage } from "./components/LoadingPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      minWidth: "70%", // TODO: kenton pls fix but this makes it work on small screens
    },
  })
);

const darkMode = createMuiTheme({
  // Disable shadows
  // shadows: Array(25).fill("none") as Shadows,
  typography: {
    fontFamily: [
      "myriad-pro",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    body1: {
      fontWeight: "inherit", // omg don't change this took me FOREVER TO FIND - nat
      fontSize: "inherit",
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: "#5c5c5c",
      contrastText: "#FFFFFF",
    }
  },
});

const lightMode = createMuiTheme({
  // Disable shadows
  // shadows: Array(25).fill("none") as Shadows,
  typography: {
    fontFamily: [
      "myriad-pro",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    body1: {
      fontWeight: "inherit", // omg don't change this took me FOREVER TO FIND - nat
      fontSize: "inherit",
    },
  },
  palette: {
    primary: {
      main: "#0B3954",
      contrastText: "#BFD7EA",
      light: "#FAFAFA",
    },
    secondary: {
      main: "#BFD7EA",
    },
  },
});



export default function App() {
  const classes = useStyles();

  const [theme, setTheme] = React.useState(darkMode);
  const [themeName, setThemeName] = React.useState("light")

  const toggleTheme = () => {
    if (themeName === "light") {
      setThemeName("dark");
      setTheme(darkMode); 
    } else {
      setThemeName("light");
      setTheme(lightMode);
    }
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [loaded, setLoaded] = React.useState(false);

  const [user, setUser] = useState(null as firebase.User | null);

  useEffect(() => {
    if (!loaded) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) setUser(user);
        else {
          setUser(null);
        }
        setLoaded(true);
      });
    }
  }, []);

  if (!loaded) return <LoadingPage />;

  const screen = () => {
    if (!user) return <Login />;

    return (
      <>
        <Sidebar toggleTheme={toggleTheme}/>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {modules.map((module) => (
            <Route {...module.routeProps} key={module.name} />
          ))}
        </main>
      </>
    );
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          {screen()}
        </div>
      </ThemeProvider>
    </Router>
  );
}

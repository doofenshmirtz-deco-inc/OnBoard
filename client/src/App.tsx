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
import { Shadows } from "@material-ui/core/styles/shadows";

import modules from "./modules";
import Sidebar from "./components/Sidebar";

import * as firebase from "firebase/app";
import "firebase/auth";
import { Login } from "./modules/Login";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { LoadingPage } from "./components/LoadingPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      overflowX: "hidden",
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
    },
  })
);

export default function App() {
  const classes = useStyles();
  const theme = createMuiTheme({
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
    },
  });

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [loaded, setLoaded] = React.useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyAwD46JJ62Y_Jn-2JFV3j6-la7djOZLa1c",
    authDomain: "onboard-8f0f9.firebaseapp.com",
    databaseURL: "https://onboard-8f0f9.firebaseio.com",
    projectId: "onboard-8f0f9",
    storageBucket: "onboard-8f0f9.appspot.com",
    messagingSenderId: "1083512866922",
    appId: "1:1083512866922:web:efe355acf6404782c22213",
  };

  const [user, setUser] = useState(null as firebase.User | null);

  useEffect(() => {
    if (!loaded) {
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) setUser(user);
        else setUser(null);
        setLoaded(true);
      });
    }
  }, []);

  const client = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
  });

  if (!loaded) return <LoadingPage />;

  const screen = () => {
    if (!user) return <Login />;

    return (
      <>
        <Sidebar />
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
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            {screen()}
          </div>
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  );
}

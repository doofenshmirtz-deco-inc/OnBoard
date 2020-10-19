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
import { createUploadLink } from "apollo-upload-client";
import {
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  split,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { persistCache, PersistentStorage } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import firebase from "firebase";
import { getMainDefinition } from "@apollo/client/utilities";
import modules from "./modules";
import Sidebar from "./components/Sidebar";
import { Login } from "./modules/Login";
import { LoadingPage } from "./components/LoadingPage";
import { PersistedData } from "apollo3-cache-persist/lib/types";

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
    secondary: {
      main: "#BFD7EA",
    },
  },
});

const getClient = async () => {
  const httpLink = (createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
    headers: {
      "keep-alive": "true",
    },
  }) as unknown) as ApolloLink;

  const authLink = setContext(async (_, { headers }) => {
    const token = await firebase.auth().currentUser?.getIdToken();
    return {
      headers: {
        ...headers,
        authorization: token ? token : "",
      },
    };
  });

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS!,
    options: {
      reconnect: true,
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const cache = new InMemoryCache();
  await persistCache({
    cache,
    storage: window.localStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >,
  });

  return new ApolloClient({
    link: authLink.concat(splitLink),
    cache,
  });
};

export default function App() {
  const [client, setClient] = useState(null as ApolloClient<any> | null);
  const classes = useStyles();

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
  }, [loaded]);

  useEffect(() => {
    getClient().then((c) => setClient(c));
  }, []);

  firebase.auth().onAuthStateChanged(() => {
    if (client) client.resetStore();
  });

  if (!loaded || !client) return <LoadingPage />;

  const screen = () => {
    if (!user) return <Login />;

    return (
      <ApolloProvider client={client}>
        <Sidebar />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {modules.map((module) => (
            <Route {...module.routeProps} key={module.name} />
          ))}
        </main>
      </ApolloProvider>
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

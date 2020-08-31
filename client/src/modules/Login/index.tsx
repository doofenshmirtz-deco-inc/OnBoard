import React, { createRef, useContext } from "react";
import {
  TextField,
  makeStyles,
  Card,
  Grid,
  Button,
  CircularProgress,
  createStyles,
} from "@material-ui/core";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import * as firebase from "firebase";
import { AppContext } from "../../utils/AppContextProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  spinnerGrid: {
    margin: theme.spacing(3),
  },
}));

const GET_CUSTOM_TOKEN = gql`
  query GetCustomToken($uid: String!) {
    getCustomToken(testUID: $uid) {
      token
    }
  }
`;

export const Login = () => {
  const classes = useStyles();
  const client = useApolloClient();
  const appContext = useContext(AppContext);

  const [uid, setUID] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    // TODO display loading wheel
    setLoading(true);
    const { data } = await client
      .watchQuery({ query: GET_CUSTOM_TOKEN, variables: { uid: uid } })
      .result();
    const user = await firebase
      .auth()
      .signInWithCustomToken(data.getCustomToken.token);
    appContext.setUser(user.user);
  };

  if (loading)
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.spinnerGrid}
      >
        <CircularProgress />
      </Grid>
    );

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <h1>Login</h1>
      <form className={classes.root}>
        <TextField
          id="standard-basic"
          label="uid"
          onChange={(e) => setUID(e.currentTarget.value)}
        />
        <TextField
          id="standard-input-password"
          label="password"
          onChange={(e) => setPass(e.currentTarget.value)}
        />
        <Button color="primary" onClick={submit}>
          Login
        </Button>
      </form>
    </Grid>
  );
};

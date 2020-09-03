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
import { LoadingPage } from "../../components/LoadingPage";

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

  const [uid, setUID] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    const { data } = await client
      .watchQuery({ query: GET_CUSTOM_TOKEN, variables: { uid: uid } })
      .result();
    const user = await firebase
      .auth()
      .signInWithCustomToken(data.getCustomToken.token);
  };

  if (loading) return <LoadingPage />;

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
			type="password"
          onChange={(e) => setPass(e.currentTarget.value)}
        />
        <Button color="primary" onClick={submit}>
          Login
        </Button>
      </form>
    </Grid>
  );
};

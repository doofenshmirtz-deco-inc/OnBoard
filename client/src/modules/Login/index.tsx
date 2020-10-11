import React from "react";
import { TextField, makeStyles, Grid, Button } from "@material-ui/core";
import { gql, useApolloClient } from "@apollo/client";
import * as firebase from "firebase";
import { LoadingPage } from "../../components/LoadingPage";
import { GetCustomToken } from "../../graphql/GetCustomToken";
import Alert from "@material-ui/lab/Alert";

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
  const [incorrectPwd, setIncorrectPwd] = React.useState(false);
  const [errorPwd, setErrorPwd] = React.useState(false);
  const [errorCode, setErrorCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const submit = async () => {
    setLoading(true);
    const { data } = await client
      .watchQuery<GetCustomToken>({
        query: GET_CUSTOM_TOKEN,
        variables: { uid: uid },
      })
      .result();

    if (!data || !data.getCustomToken.token) return; // TODO actual error handling pls

    await firebase
      .auth()
      .signInWithEmailAndPassword(uid + "@doofenshmirtz.xyz", pass)
      .then(function (user) {
        firebase.auth().signInWithCustomToken(data.getCustomToken.token);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // It's a security thing to not differentiate between missing user and wrong password right?
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          console.log(errorCode, errorMessage);
          setIncorrectPwd(true);
          setLoading(false);
          // Any other sort of error
        } else {
          console.log(errorCode, errorMessage);
          setErrorPwd(true);
          setErrorCode(errorCode);
          setErrorMessage(errorMessage);
          setLoading(false);
        }
      });
  };

  if (loading) return <LoadingPage />;

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <h1>Welcome to OnBoard</h1>
      <form className={classes.root} onSubmit={submit}>
        {incorrectPwd && (
          <Alert severity="error">
            Incorrect username or password. Please try again.
          </Alert>
        )}
        {errorPwd && (
          <Alert severity="error">
            {errorCode}: {errorMessage}
          </Alert>
        )}
        <TextField
          id="standard-basic"
          label="Username/Email"
          onChange={(e) => setUID(e.currentTarget.value)}
        />
        <TextField
          id="standard-input-password"
          label="Password"
          type="password"
          onChange={(e) => setPass(e.currentTarget.value)}
        />
        <Button color="primary" type="submit">
          Login
        </Button>
      </form>
    </Grid>
  );
};

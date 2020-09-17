import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import firebase from "firebase";

const httpLink = (createUploadLink({
  uri: "http://localhost:5000/graphql",
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const firebaseConfig = {
  apiKey: "AIzaSyAwD46JJ62Y_Jn-2JFV3j6-la7djOZLa1c",
  authDomain: "onboard-8f0f9.firebaseapp.com",
  databaseURL: "https://onboard-8f0f9.firebaseio.com",
  projectId: "onboard-8f0f9",
  storageBucket: "onboard-8f0f9.appspot.com",
  messagingSenderId: "1083512866922",
  appId: "1:1083512866922:web:efe355acf6404782c22213",
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => client.resetStore());

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

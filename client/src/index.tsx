import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase";

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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

import React from "react";
import HomeIcon from "@material-ui/icons/Home";

const Home = () => <h1>Home</h1>;

export default {
  routeProps: {
    path: "/",
    component: Home,
    exact: true,
  },
  name: "Home",
  icon: HomeIcon,
};

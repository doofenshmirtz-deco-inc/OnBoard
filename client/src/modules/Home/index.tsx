import React from "react";
import HomeIcon from "@material-ui/icons/Home";

import ContactList from "../../components/ContactList";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <ContactList></ContactList>
    </div>
  );
};

export default {
  routeProps: {
    path: "/",
    component: Home,
    exact: true,
  },
  name: "Home",
  icon: HomeIcon,
};

import React from "react";
import ClassIcon from "@material-ui/icons/Class";

const Classes = () => <h1>My Classes</h1>;

export default {
  routeProps: {
    path: "/classes",
    component: Classes,
  },
  name: "My Classes",
  icon: ClassIcon,
};

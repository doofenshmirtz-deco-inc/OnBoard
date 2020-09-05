import React from "react";
import ClassIcon from "@material-ui/icons/Class";
import { Container } from "@material-ui/core";
import ClassesTabs from "../../components/ClassesTabs";

const Classes = () => (
  <>
    <h1>My Classes</h1>
    <ClassesTabs />
  </>
);

export default {
  routeProps: {
    path: "/classes",
    component: Classes,
  },
  name: "My Classes",
  icon: ClassIcon,
};

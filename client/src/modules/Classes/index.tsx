import React from "react";
import ClassIcon from "@material-ui/icons/Class";
import MenuBar from "../../components/MenuBar";

function Classes() {
  return (
    <div>
      <h1>My Classes</h1>
      <MenuBar></MenuBar>
    </div>
  )
}

export default {
  routeProps: {
    path: "/classes",
    component: Classes,
  },
  name: "My Classes",
  icon: ClassIcon,
};

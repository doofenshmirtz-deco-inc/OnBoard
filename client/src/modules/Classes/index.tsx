/**
 * Component for the page that displays classes. Uses route paths
 * to determine what class to display.
 */

import React from "react";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ClassesTabs from "./ClassView";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ClassesList } from "./ClassesList";

function Classes() {
  let { url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/:classId`}>
        <ClassesTabs />
      </Route>
      <Route path="/">
        <h1>My Classes</h1>
        <ClassesList />
      </Route>
    </Switch>
  );
}

export default {
  routeProps: {
    path: "/classes",
    component: Classes,
  },
  name: "My Classes",
  icon: MenuBookIcon,
};

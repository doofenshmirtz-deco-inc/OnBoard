import React from "react";
import ClassIcon from "@material-ui/icons/Class";
import ClassesList from "../../components/ClassesList"
import ClassesTabs from "../../components/ClassesTabs";
import { Route, Switch, BrowserRouter } from "react-router-dom";

const Classes = () => (
  <>
    <BrowserRouter>
      <Switch>
        <Route path="/classes/:classId">
          <h1>A Class</h1>
          <ClassesTabs />
        </Route>
        <Route path="/">
          <h1>My Classes</h1>
          <ClassesList/>
        </Route>
      </Switch>
    </BrowserRouter>
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

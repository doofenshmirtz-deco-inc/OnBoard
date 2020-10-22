import React from "react";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ClassesList from "../../components/ClassesList";
import ClassesTabs from "../../components/ClassView";
import { Route, Switch, useRouteMatch } from "react-router-dom";

// const Classes = (props: RouteComponentProps) => (
//   <>

//   </>
// );

function Classes() {
  let { url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/:classId`}>
        <ClassesTabs />
      </Route>
      <Route path="/">
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

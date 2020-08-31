import React from "react";
import EventIcon from "@material-ui/icons/Event";
import Cal from "../../components/Cal";

const Calendar = () => (
  <div>
    <h1>My Calendar</h1>
    <Cal />
  </div>
);

export default {
  routeProps: {
    path: "/calendar",
    component: Calendar,
  },
  name: "My Calendar",
  icon: EventIcon,
};

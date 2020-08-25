import React from "react";
import EventIcon from "@material-ui/icons/Event";

const Calendar = () => <h1>My Calendar</h1>;

export default {
  routeProps: {
    path: "/calendar",
    component: Calendar,
  },
  name: "My Calendar",
  icon: EventIcon,
};

import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";

const MeetingRooms = () => <h1>Meeting Rooms</h1>;

export default {
  routeProps: {
    path: "/meeting-rooms",
    component: MeetingRooms,
  },
  name: "Meeting Rooms",
  icon: MeetingRoomIcon,
};

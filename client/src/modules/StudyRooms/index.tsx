import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";

const StudyRooms = () => <h1>Study Rooms</h1>;

export default {
  routeProps: {
    path: "/study-rooms",
    component: StudyRooms,
  },
  name: "Study Rooms",
  icon: MeetingRoomIcon,
};

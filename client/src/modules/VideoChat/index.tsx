import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";

const config = {
  prejoinPageEnabled: false,
} as any;

const VideoChat = () => (
  <>
    <h1>Video Chat</h1>
    <Jitsi config={config} />
  </>
);

export default {
  routeProps: {
    path: "/video",
    component: VideoChat,
  },
  name: "Video Chat",
  icon: MeetingRoomIcon,
};

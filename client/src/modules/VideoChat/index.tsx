import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";

const config = {
  prejoinPageEnabled: false,
} as any;

const style = {
  width: "100%",
  height: "calc(100% - 130px)", // TODO this is hacky (might be able to get rid of this (and the other heigh: 100%) once its in a grid)
};

const VideoChat = () => (
  <>
    <h1>Video Chat</h1>
    <Jitsi config={config} containerStyle={style} />
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

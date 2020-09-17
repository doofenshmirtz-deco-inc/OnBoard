import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";
import { InterfaceConfigOptions } from "react-jitsi/dist/types";

const config = {
  prejoinPageEnabled: false,
} as any;

/* 
const interfaceConfig = {
  APP_NAME: "Study Rooms",
  MOBILE_APP_PROMO: false,
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  TOOLBAR_BUTTONS: [
    "microphone",
    "camera",
    "closedcaptions",
    "desktop",
    "fullscreen",
    "hangup",
    "etherpad",
    "settings",
    "raisehand",
    "filmstrip",
    "tileview",
    "mute-everyone",
    "stats",
    //"security",
  ],
} as InterfaceConfigOptions;
 */

const style = {
  width: "100%",
  height: "calc(100% - 130px)", // TODO this is hacky (might be able to get rid of this (and the other heigh: 100%) once its in a grid)
};

const VideoChat = () => (
  <>
    <h1>Video Chat</h1>
    <Jitsi
      config={config}
      containerStyle={style}
      displayName="Username"
      roomName="Room"
      domain="localhost:8443"
    />
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

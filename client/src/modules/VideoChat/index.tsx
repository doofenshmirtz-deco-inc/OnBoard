import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";
import { InterfaceConfigOptions, JitsiMeetAPI } from "react-jitsi/dist/types";
import { gql, useQuery } from "@apollo/client";
import { LoadingPage } from "../../components/LoadingPage";
import { ME_VIDEO } from "../../graphql/ME_VIDEO";
import { useHistory } from "react-router";

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

const ME = gql`
  query ME_VIDEO {
    me {
      name
    }
  }
`;

const handleAIP = (api: any, history: any) => {
  api.on("readyToClose", () => history.push("/"));
};

const VideoChat = () => {
  const { loading, error, data } = useQuery<ME_VIDEO>(ME);

  const history = useHistory();

  return data && data.me ? (
    <>
      <h1>Video Chat</h1>
      <Jitsi
        config={config}
        containerStyle={style}
        displayName={data.me.name}
        roomName="Room"
        domain="localhost:8443"
        loadingComponent={() => <LoadingPage />}
        onAPILoad={(api) => handleAIP(api, history)}
      />
    </>
  ) : (
    <LoadingPage />
  );
};

export default {
  routeProps: {
    path: "/video",
    component: VideoChat,
  },
  name: "Video Chat",
  icon: MeetingRoomIcon,
};

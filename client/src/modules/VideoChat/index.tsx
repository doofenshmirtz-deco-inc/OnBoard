import React from "react";
import Videocam from "@material-ui/icons/Videocam";
import Jitsi from "react-jitsi";
import { InterfaceConfigOptions, JitsiMeetAPI } from "react-jitsi/dist/types";
import { gql, useQuery } from "@apollo/client";
import { LoadingPage } from "../../components/LoadingPage";
import { ME_VIDEO } from "../../graphql/ME_VIDEO";
import { useHistory } from "react-router";
import VideoChat from "../../components/VideoChat";

const VideoChatPage = () => {
  return <VideoChat name="Room Name" password="asdf1234" />;
};

export default {
  routeProps: {
    path: "/video",
    component: VideoChatPage,
  },
  name: "Video Chat",
  icon: Videocam,
};

import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router";
import { ME_VIDEO } from "../graphql/ME_VIDEO";
import { LoadingPage } from "./LoadingPage";

const config = {
  prejoinPageEnabled: false,
} as any;

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

const handleAIP = (api: any, history: any, password: string) => {
  api.on("passwordRequired", () => api.executeCommand("password", password));
  api.on("readyToClose", () => history.push("/"));
};

interface Props {
  name: string; // Name must not have any spaces
  password: string;
}

export default (props: Props) => {
  const { loading, error, data } = useQuery<ME_VIDEO>(ME);

  const history = useHistory();

  // TODO: domain should be come from .env at some point probably
  return data && data.me ? (
    <>
      <h1>Video Chat</h1>
      <Jitsi
        config={config}
        containerStyle={style}
        displayName={data.me.name}
        roomName={props.name.replace(" ", "")}
        password={props.password}
        domain={process.env.REACT_APP_JITSI_DOMAIN}
        loadingComponent={() => <LoadingPage />}
        onAPILoad={(api) => handleAIP(api, history, props.password)}
      />
    </>
  ) : (
    <LoadingPage />
  );
};

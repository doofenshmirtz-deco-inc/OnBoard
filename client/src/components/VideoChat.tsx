import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Jitsi from "react-jitsi";
import { gql, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { ME_VIDEO } from "../graphql/ME_VIDEO";
import { LoadingPage } from "./LoadingPage";
import { Group } from "../graphql/Group";

const config = {
  prejoinPageEnabled: false,
} as any;

const style = {
  width: "100%",
  height: "calc(100% - 130px)", // TODO this is hacky (might be able to get rid of this (and the other heigh: 100%) once its in a grid)
};

interface Params {
  groupID: string;
}

const ME = gql`
  query ME_VIDEO {
    me {
      name
    }
  }
`;

const QueryGroup = gql`
  query Group($id: ID!) {
    userGroup(id: $id) {
      id
      name
      meetingPassword
    }
  }
`;

const handleAIP = (api: any, history: any, password: string) => {
  api.on("participantRoleChanged", (event: any) => {
    if (event.role === "moderator") {
      api.executeCommand("password", password);
    }
  });
  api.on("passwordRequired", () => api.executeCommand("password", password));
  api.on("readyToClose", () => history.push("/"));
};

export default () => {
  let { groupID } = useParams<Params>();
  const { data: meData } = useQuery<ME_VIDEO>(ME);
  const { data } = useQuery<Group>(QueryGroup, { variables: { id: groupID } });

  const history = useHistory();

  return meData && meData.me && data && data.userGroup ? (
    <>
      <Jitsi
        config={config}
        containerStyle={style}
        displayName={meData.me.name}
        roomName={data.userGroup.name}
        domain={process.env.REACT_APP_JITSI_DOMAIN}
        loadingComponent={() => <LoadingPage />}
        onAPILoad={(api) =>
          handleAIP(api, history, data.userGroup!.meetingPassword)
        }
      />
    </>
  ) : (
    <LoadingPage />
  );
};

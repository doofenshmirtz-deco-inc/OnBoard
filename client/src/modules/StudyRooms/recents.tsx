import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { gql, useQuery } from "@apollo/client";
import { MyGroups } from "../../graphql/MyGroups";
import { LoadingPage } from "../../components/LoadingPage";
import { MeId } from "../../graphql/MeId";

const GROUPS_QUERY = gql`
  query MyGroups {
    me {
      groups {
        ... on DMGroup {
          id
          name
        }
        ... on ClassGroup {
          id
          name
        }
        ... on CourseGroup {
          id
          name
        }
        ... on StudyGroup {
          id
          name
        }
      }
    }
  }
`;

const ME_QUERY = gql`
  query MeId {
    me {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 3,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
}));

const Recents = () => {
  const [message, setMessageState] = useState({
    id: "INVALID",
    name: "",
  });

  const [selected, setSelectedState] = useState("");
  const handleClick = (item: any) => {
    setMessageState(item);
    setSelectedState(item);
  };

  const classes = useStyles();

  // get my recently contacted
  const { data, loading } = useQuery<MyGroups>(GROUPS_QUERY);
  // get my id
  const me = useQuery<MeId>(ME_QUERY);

  // TODO: somehow fix this dodgy AF code???????
  if (
    loading ||
    !data ||
    !data.me ||
    !data.me.groups ||
    !me.data ||
    !me.data.me
  ) {
    return <LoadingPage />;
  }

  const myGroups = data.me.groups.map((group) => {
    return {
      id: parseInt(group.id, 10),
      name: `${group.name}-${group.id}`,
    };
  });

  return (
    <div className={classes.root}>
      <RecentContacts
        contacts={myGroups}
        handleClick={handleClick}
        selected={selected}
      />
      {selected === "" ? (
        <div />
      ) : (
        <MessageBox myId={me.data.me.id} id={message.id} name={message.name} />
      )}
    </div>
  );
};

export default Recents;

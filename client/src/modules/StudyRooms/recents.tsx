import React, { useState, useMemo } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { MyGroups } from "../../graphql/MyGroups";
import { LoadingPage } from "../../components/LoadingPage";
import { MeId } from "../../graphql/MeId";
import { OnMessageSent } from "../../graphql/OnMessageSent";
import { MyMessages } from "../../graphql/MyMessages";
import NewMessage from "../../components/NewMessage";
import ChatMessage from "../../components/ChatMessage";

const GROUPS_QUERY = gql`
  query MyGroups {
    me {
      groups {
        ... on DMGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on ClassGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on CourseGroup {
          id
          name
          users {
            id
            name
            avatar
          }
        }
        ... on StudyGroup {
          id
          name
          users {
            id
            name
            avatar
          }
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

const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageSent($uid: ID!) {
    newMessages(uid: $uid) {
      text
      group {
        id
      }
      user {
        id
      }
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
  const [selected, setSelectedState] = useState({
    id: "",
    name: "",
  });

  const [contacts, setContacts] = useState([{}]);
  const [uid, setUID] = useState("");
  const [newMessage, setNewMessage] = useState({} as ChatMessage);

  const handleClick = (item: any) => {
    setSelectedState(item);
  };

  const classes = useStyles();

  // get my recently contacted
  const { data, loading } = useQuery<MyGroups>(GROUPS_QUERY);
  // get my id
  const me = useQuery<MeId>(ME_QUERY);

  const subscription = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { uid: uid },
  });

  // TODO: probs fix this dodgy code?
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

  const myGroups = data.me.groups.map((group: any) => {
    return {
      id: parseInt(group.id, 10),
      name: group.name,
      group: group.users.length > 2,
      users: group.users,
    };
  });

  if (contacts.length !== myGroups.length) {
    setContacts(myGroups);
  }

  if (uid === "") {
    setUID(me.data.me.id);
  }

  if (subscription && subscription.data && subscription.data.newMessages && !newMessage.text) {
    const message = subscription?.data?.newMessages;
    const newMsg: ChatMessage = {
      text: message?.text,
      sender: message?.user.id,
      direction: message?.user.id === uid ? "right" : "left",
      groupId: parseInt(message?.group.id, 10)
    };

    console.log(newMsg);
    if (newMsg.sender !== uid) {
      setNewMessage(newMsg);
      // console.log("hi")
      // console.log(newMsg);
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <RecentContacts
          contacts={contacts}
          handleClick={handleClick}
          selected={selected}
        />
        {selected.id === "" ? (
          <div />
        ) : (
          <MessageBox
            contacts={contacts}
            setContacts={setContacts}
            newMessage={newMessage}
            setNewMessage={() => setNewMessage}
            myId={uid}
            id={selected.id}
            name={selected.name}
          />
        )}
      </div>
    </div>
  );
};

export default Recents;

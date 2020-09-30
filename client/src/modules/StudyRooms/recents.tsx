import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { gql, useQuery } from "@apollo/client";
import { MyGroups } from "../../graphql/MyGroups";
import { LoadingPage } from "../../components/LoadingPage";
import { MeId } from "../../graphql/MeId";
import { OnMessageSent } from "../../graphql/OnMessageSent";
import { MyMessages } from "../../graphql/MyMessages";

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

  const [messages, setMessages] = useState([{}]);
  const [contacts, setContacts] = useState([{}]);

  const handleClick = (item: any) => {
    setSelectedState(item);
  };

  const classes = useStyles();

  // get my recently contacted
  const { data, loading } = useQuery<MyGroups>(GROUPS_QUERY);
  // get my id
  const me = useQuery<MeId>(ME_QUERY);

  // useEffect(() => {
  //   subscribeToMore<OnMessageSent>({
  //     document: MESSAGES_SUBSCRIPTION,
  //     variables: { groupId: props.id },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData.data) {
  //         return prev;
  //       }

  //       const newMessage = {
  //         text: subscriptionData.data.newMessages.text,
  //         direction: "left",
  //         sender: props.id
  //       };

  //       // console.log(newMessage);
  //       return Object.assign({}, prev, {
  //         getMessages: [newMessage, ...messages],
  //       });
  //     },
  //   });
  // });

  // TODO: somehow fix this dodgy AF code???????
  if (
    loading ||
    console.log("BITCH WHAT THE FUCK 1") ||
    !data ||
    console.log("BITCH WHAT THE FUCK 2") ||
    !data.me ||
    console.log("BITCH WHAT THE FUCK 3") ||
    !data.me.groups ||
    console.log("BITCH WHAT THE FUCK 3") ||
    !me.data ||
    console.log("BITCH WHAT THE FUCK 4") ||
    !me.data.me
  ) {
    console.log(data);
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

  console.log(myGroups);
  if (contacts.length !== myGroups.length) {
    setContacts(myGroups);
  }

  return (
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
          myId={me.data.me.id}
          id={selected.id}
          name={selected.name}
        />
      )}
    </div>
  );
};

export default Recents;

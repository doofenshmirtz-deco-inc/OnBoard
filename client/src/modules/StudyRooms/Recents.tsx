import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { gql, useQuery } from "@apollo/client";
import { MyGroups } from "../../graphql/MyGroups";
import { LoadingPage } from "../../components/LoadingPage";
import { MeId } from "../../graphql/MeId";
import { useHistory, useParams } from "react-router";

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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 3,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
}));

export type Contact = {
  id: string;
  name: string;
  group: boolean;
  users: any[];
  readStatus: boolean;
};

const Recents = () => {
  const classes = useStyles();

  // currently selected contact id and name.
  const [selected, setSelectedState] = useState({
    id: "",
    name: "",
  });

  // list of contacts/groups, sorted by recency.
  const [contacts, setContacts] = useState(null as Contact[] | null);

  const params = useParams<{ messageID?: string }>();
  const history = useHistory();

  // handles a click on a contact/group by selecting that contact.
  const handleClick = (item: any) => {
    history.push("/study-rooms/recents/" + item.id);
  };

  // callback handler to bump the currently selected group to the top of the list.
  // passed to message box so it can be called when a new message is received.
  const bumpSelectedContact = useCallback(() => {
    if (!contacts) return;
    const selectedContacts = contacts.filter((c) => c.id === selected.id);
    const notSelectedContacts = contacts.filter((c) => c.id !== selected.id);
    setContacts([...selectedContacts, ...notSelectedContacts]);
  }, [selected, contacts]);
  // TODO: probably sort contacts initially as well. will need to sort server-side or return times in query.

  // get my recently contacted groups
  const { data, loading } = useQuery<MyGroups>(GROUPS_QUERY);
  // get my id.
  // TODO: pass uid as prop?
  const { data: me, loading: meLoading } = useQuery<MeId>(ME_QUERY);
  const uid = me?.me?.id;

  // run when data from groups query is obtained.
  useEffect(() => {
    const myGroups = data?.me?.groups?.map((group: any) => {
      return {
        id: group.id,
        name: group.name,
        group: group.users.length > 2,
        users: group.users,
        readStatus: true,
      };
    });

    if (myGroups) setContacts(myGroups); // FIXME: resets order...
  }, [data]);

  useEffect(() => {
    if (params.messageID && contacts) {
      const selectedContact = contacts.filter(
        (c) => c.id === params.messageID
      )[0];
      if (!selectedContact) history.push("/study-rooms/recents");
      else setSelectedState(selectedContact);
    }
  }, [contacts, params.messageID, selected, history]);

  if (loading || meLoading || !data?.me?.groups || !uid || !contacts) {
    return <LoadingPage />;
  }

  // TODO: NEED some way of updating messages in background. service/react context?

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
            id={selected.id}
            name={selected.name}
            contacts={contacts}
            setContacts={setContacts as any}
            onSentMessage={bumpSelectedContact}
          />
        )}
      </div>
    </div>
  );
};

export default Recents;

import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { gql, useQuery } from "@apollo/client";
import { MyGroups } from "../../graphql/MyGroups";
import { LoadingPage } from "../../components/LoadingPage";
import { MeId } from "../../graphql/MeId";
import { useHistory, useParams } from "react-router";
import ContactCard from "../../components/ContactCard";
import { Button, List } from "@material-ui/core";

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
    display: "flex",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    width: "25%",
    height: "69vh",
    overflowY: "scroll",
    paddingBottom: "0px",
    paddingLeft: "5px"
  },
  contact: {
    display: "flex",
    textTransform: "none",
    textAlign: "left",
    padding: "0",
    flexDirection: "column",
    width: "100%",
  }
}));

export type Contact = {
  id: string;
  name: string;
  group: boolean;
  users: any[];
  readStatus: boolean;
};

const Recents = (props: any) => {
  const classes = useStyles();

  // currently selected contact id and name.
  const [selected, setSelectedState] = useState({
    id: "",
    name: "",
    group: false,
    users: [] as any[],
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
      let selectedContact = contacts.filter(
        (c) => c.id === params.messageID
      )[0];
      selected.group = selectedContact.users.length > 2;
      selected.users = selectedContact.users.filter((c) => c.id !== uid);
      if (!selectedContact) history.push("/study-rooms/recents");
      else setSelectedState(selectedContact);
    }
  }, [contacts, params.messageID, selected, history]);

  if (loading || meLoading || !data?.me?.groups || !uid || !contacts) {
    return <LoadingPage />;
  }

  // TODO: NEED some way of updating messages in background. service/react context?

  console.log(selected.users);

  return (
    <div>
      <div className={classes.root}>
        <RecentContacts
          contacts={contacts}
          handleClick={handleClick}
          selected={selected}
        />
        {props.messaging ? (
          selected.id === "" ? (
            <div />
          ) : (
            <div style={{width: "100%"}}>
              <MessageBox
                uid={uid}
                id={selected.id}
                name={selected.name}
                group={selected.group}
                contacts={contacts}
                setContacts={setContacts as any}
                onSentMessage={bumpSelectedContact}
              />
              <div className={classes.list} style={{display: "inline-block", float: "right"}}>
                <h2 style={{marginBottom: "5px"}}>Members</h2>
                <List>
                  {selected.users.map((user: any) => 
                    <span className={classes.contact}>
                      <ContactCard 
                        buttonsOff
                        name={user.name}
                        avatar={user.avatar}
                        contact={{
                          name: user.name,
                          avatar: user.avatar
                        }}
                        readStatus
                      />
                    </span>  
                    )
                  }
                </List>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Recents;

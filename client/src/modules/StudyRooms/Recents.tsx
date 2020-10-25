import React, { useState, useEffect, useMemo } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MessageBox from "../../components/MessageBox";
import RecentContacts from "../../components/RecentContacts";
import { LoadingPage } from "../../components/LoadingPage";
import { useHistory, useParams } from "react-router";
import { Messaging } from "../../hooks/useMessaging";

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

  // access messaging manager from context.
  const messaging = Messaging.useContainer();

  const params = useParams<{ messageID?: string }>();
  const history = useHistory();

  // handles a click on a contact/group by selecting that contact.
  const handleClick = (item: any) => {
    messaging.setGroupId(item.id);
    history.push("/study-rooms/recents/" + item.id);
  };

  const uid = messaging.username;

  const contacts = useMemo(() => {
    return messaging.contacts?.map((group: any) => {
      return {
        ...group,
        id: group.id,
        name: group.name,
        group: group.users.length > 2,
        users: group.users,
        readStatus: true,
      };
    });
  }, [messaging.contacts]);

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

  const filteredContacts = useMemo(() => {
    // console.log(contacts);
    if (!props.messaging) {
      return contacts?.filter((c: any) => c.__typename === "DMGroup") ?? [];
    } else {
      return contacts ?? [];
    }
  }, [contacts]);

  if (!uid || !contacts || contacts.length === 0) {
    return <LoadingPage />;
  }

  // use first contact if none is selected.
  const selectedOrDefault = selected?.id ? selected : contacts[0];

  console.log(selected.users);

  return (
    <div>
      <div className={classes.root}>
        <RecentContacts
          contacts={filteredContacts}
          handleClick={handleClick}
          selected={props.messaging ? selectedOrDefault : {}}
        />
        {props.messaging && (
          <MessageBox id={selectedOrDefault.id} name={selectedOrDefault.name} />
        )}
        {/* {props.messaging ? (
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
        ) : null} */}
      </div>
    </div>
  );
};

export default Recents;

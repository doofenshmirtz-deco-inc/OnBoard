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

const Recents = (props: any) => {
  const classes = useStyles();

  // currently selected contact id and name.
  const [selected, setSelectedState] = useState({
    id: "",
    name: "",
  });

  // access messaging manager from context.
  const messaging = Messaging.useContainer();

  const params = useParams<{ messageID?: string }>();
  const history = useHistory();

  // handles a click on a contact/group by selecting that contact.
  const handleClick = (item: any) => {
    messaging.setGroupId(item.id);
    history.push("/study-rooms/recents/" + item.id);
    setSelectedState(item);
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
      const selectedContact = contacts.filter(
        (c) => c.id === params.messageID
      )[0];
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
      </div>
    </div>
  );
};

export default Recents;

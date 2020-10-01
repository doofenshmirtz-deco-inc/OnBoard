import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { LoadingPage } from "./LoadingPage";
import Message from "./Message";
import ChatMessage from "./ChatMessage";

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

const NewMessage = (props: any) => {
  const { data } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { uid: props.uid },
  });

  if (!data || !data.newMessages) {
    return <LoadingPage />;
  }

  const message = data.newMessages;
  const newMsg: ChatMessage = {
    text: message.text,
    sender: message.user.id,
    direction: message.user.id === props.uid ? "right" : "left",
    groupId: message.group.id
  };

  if (newMsg.sender !== props.uid) {
    props.setNewMessage(newMsg);
  }

  console.log("hello");
  return (
    <Message
      text={message.text}
      direction={newMsg.direction}
    />
  );
};

export default NewMessage;

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessageReceived
// ====================================================

export interface OnMessageReceived_newMessages_group {
  __typename: "BaseGroup";
  id: string;
}

export interface OnMessageReceived_newMessages_user {
  __typename: "User";
  id: string;
}

export interface OnMessageReceived_newMessages {
  __typename: "Message";
  text: string;
  group: OnMessageReceived_newMessages_group;
  user: OnMessageReceived_newMessages_user;
}

export interface OnMessageReceived {
  newMessages: OnMessageReceived_newMessages;
}

export interface OnMessageReceivedVariables {
  uid: string;
}

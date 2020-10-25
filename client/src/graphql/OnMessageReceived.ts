/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessageReceived
// ====================================================

export interface OnMessageReceived_newMessages_group_users {
  __typename: "User";
  id: string;
}

export interface OnMessageReceived_newMessages_group {
  __typename: "BaseGroup";
  id: string;
  users: OnMessageReceived_newMessages_group_users[];
}

export interface OnMessageReceived_newMessages_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface OnMessageReceived_newMessages {
  __typename: "Message";
  id: string;
  text: string;
  group: OnMessageReceived_newMessages_group;
  user: OnMessageReceived_newMessages_user;
  createdAt: any;
}

export interface OnMessageReceived {
  newMessages: OnMessageReceived_newMessages;
}

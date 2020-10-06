/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessageSent
// ====================================================

export interface OnMessageSent_newMessages_group {
  __typename: "BaseGroup";
  id: string;
}

export interface OnMessageSent_newMessages_user {
  __typename: "User";
  id: string;
}

export interface OnMessageSent_newMessages {
  __typename: "Message";
  text: string;
  group: OnMessageSent_newMessages_group;
  user: OnMessageSent_newMessages_user;
}

export interface OnMessageSent {
  newMessages: OnMessageSent_newMessages;
}

export interface OnMessageSentVariables {
  uid: string;
}

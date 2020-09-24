/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessageSent
// ====================================================

export interface OnMessageSent_newMessages {
  __typename: "Message";
  text: string;
}

export interface OnMessageSent {
  newMessages: OnMessageSent_newMessages;
}

export interface OnMessageSentVariables {
  groupId: string;
}

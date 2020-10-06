/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddMessage
// ====================================================

export interface AddMessage_addMessage {
  __typename: "Message";
  id: string;
}

export interface AddMessage {
  addMessage: AddMessage_addMessage;
}

export interface AddMessageVariables {
  send: string;
  groupId: string;
}

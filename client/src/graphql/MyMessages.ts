/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyMessages
// ====================================================

export interface MyMessages_getMessages_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface MyMessages_getMessages_group {
  __typename: "BaseGroup";
  id: string;
}

export interface MyMessages_getMessages {
  __typename: "Message";
  id: string;
  text: string;
  user: MyMessages_getMessages_user;
  group: MyMessages_getMessages_group;
  createdAt: any;
}

export interface MyMessages {
  getMessages: MyMessages_getMessages[];
}

export interface MyMessagesVariables {
  groupId: string;
}

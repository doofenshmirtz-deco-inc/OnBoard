/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Group
// ====================================================

export interface Group_userGroup {
  __typename: "BaseGroup";
  id: string;
  name: string;
  meetingPassword: string;
}

export interface Group {
  userGroup: Group_userGroup | null;
}

export interface GroupVariables {
  id: string;
}

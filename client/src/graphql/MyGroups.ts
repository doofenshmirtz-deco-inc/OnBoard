/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyGroups
// ====================================================

export interface MyGroups_me_groups {
  __typename: "BaseGroup";
  id: string;
}

export interface MyGroups_me {
  __typename: "User";
  groups: MyGroups_me_groups[];
}

export interface MyGroups {
  me: MyGroups_me | null;
}

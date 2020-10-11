/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Contacts
// ====================================================

export interface Contacts_me_groups_ClassGroup {
  __typename: "ClassGroup" | "CourseGroup" | "StudyGroup";
}

export interface Contacts_me_groups_DMGroup_users {
  __typename: "User";
  id: string;
}

export interface Contacts_me_groups_DMGroup {
  __typename: "DMGroup";
  id: string;
  name: string;
  users: Contacts_me_groups_DMGroup_users[];
}

export type Contacts_me_groups =
  | Contacts_me_groups_ClassGroup
  | Contacts_me_groups_DMGroup;

export interface Contacts_me {
  __typename: "User";
  groups: Contacts_me_groups[];
}

export interface Contacts {
  me: Contacts_me | null;
}

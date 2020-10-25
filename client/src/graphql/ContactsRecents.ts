/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactsRecents
// ====================================================

export interface ContactsRecents_me_groups_ClassGroup {
  __typename: "ClassGroup" | "CourseGroup" | "StudyGroup";
}

export interface ContactsRecents_me_groups_DMGroup_users {
  __typename: "User";
  id: string;
}

export interface ContactsRecents_me_groups_DMGroup {
  __typename: "DMGroup";
  id: string;
  name: string;
  users: ContactsRecents_me_groups_DMGroup_users[];
}

export type ContactsRecents_me_groups =
  | ContactsRecents_me_groups_ClassGroup
  | ContactsRecents_me_groups_DMGroup;

export interface ContactsRecents_me {
  __typename: "User";
  groups: ContactsRecents_me_groups[];
}

export interface ContactsRecents {
  me: ContactsRecents_me | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Classes
// ====================================================

export interface Classes_me_groups_CourseGroup {
  __typename: "CourseGroup" | "DMGroup" | "StudyGroup";
}

export interface Classes_me_groups_ClassGroup_users {
  __typename: "User";
  id: string;
}

export interface Classes_me_groups_ClassGroup {
  __typename: "ClassGroup";
  id: string;
  name: string;
  users: Classes_me_groups_ClassGroup_users[];
}

export type Classes_me_groups =
  | Classes_me_groups_CourseGroup
  | Classes_me_groups_ClassGroup;

export interface Classes_me {
  __typename: "User";
  groups: Classes_me_groups[];
}

export interface Classes {
  me: Classes_me | null;
}

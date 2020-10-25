/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyGroupsxx
// ====================================================

export interface MyGroupsxx_me_groups_DMGroup_users {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
}

export interface MyGroupsxx_me_groups_DMGroup {
  __typename: "DMGroup";
  id: string;
  name: string;
  users: MyGroupsxx_me_groups_DMGroup_users[];
}

export interface MyGroupsxx_me_groups_ClassGroup_users {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
}

export interface MyGroupsxx_me_groups_ClassGroup {
  __typename: "ClassGroup";
  id: string;
  name: string;
  users: MyGroupsxx_me_groups_ClassGroup_users[];
}

export interface MyGroupsxx_me_groups_CourseGroup_users {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
}

export interface MyGroupsxx_me_groups_CourseGroup {
  __typename: "CourseGroup";
  id: string;
  name: string;
  users: MyGroupsxx_me_groups_CourseGroup_users[];
}

export interface MyGroupsxx_me_groups_StudyGroup_users {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
}

export interface MyGroupsxx_me_groups_StudyGroup {
  __typename: "StudyGroup";
  id: string;
  name: string;
  users: MyGroupsxx_me_groups_StudyGroup_users[];
}

export type MyGroupsxx_me_groups =
  | MyGroupsxx_me_groups_DMGroup
  | MyGroupsxx_me_groups_ClassGroup
  | MyGroupsxx_me_groups_CourseGroup
  | MyGroupsxx_me_groups_StudyGroup;

export interface MyGroupsxx_me {
  __typename: "User";
  groups: MyGroupsxx_me_groups[];
}

export interface MyGroupsxx {
  me: MyGroupsxx_me | null;
}

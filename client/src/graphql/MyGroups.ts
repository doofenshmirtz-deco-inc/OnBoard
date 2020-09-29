/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyGroups
// ====================================================

export interface MyGroups_me_groups_DMGroup {
  __typename: "DMGroup";
  id: string;
  name: string;
}

export interface MyGroups_me_groups_ClassGroup {
  __typename: "ClassGroup";
  id: string;
  name: string;
}

export interface MyGroups_me_groups_CourseGroup {
  __typename: "CourseGroup";
  id: string;
  name: string;
}

export interface MyGroups_me_groups_StudyGroup {
  __typename: "StudyGroup";
  id: string;
  name: string;
}

export type MyGroups_me_groups =
  | MyGroups_me_groups_DMGroup
  | MyGroups_me_groups_ClassGroup
  | MyGroups_me_groups_CourseGroup
  | MyGroups_me_groups_StudyGroup;

export interface MyGroups_me {
  __typename: "User";
  groups: MyGroups_me_groups[];
}

export interface MyGroups {
  me: MyGroups_me | null;
}

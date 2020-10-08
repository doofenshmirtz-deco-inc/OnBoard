/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StudyRooms
// ====================================================

export interface StudyRooms_userGroups_ClassGroup {
  __typename: "ClassGroup" | "CourseGroup" | "DMGroup";
}

export interface StudyRooms_userGroups_StudyGroup_users {
  __typename: "User";
  id: string;
}

export interface StudyRooms_userGroups_StudyGroup {
  __typename: "StudyGroup";
  name: string;
  users: StudyRooms_userGroups_StudyGroup_users[];
}

export type StudyRooms_userGroups = StudyRooms_userGroups_ClassGroup | StudyRooms_userGroups_StudyGroup;

export interface StudyRooms {
  userGroups: StudyRooms_userGroups[];
}

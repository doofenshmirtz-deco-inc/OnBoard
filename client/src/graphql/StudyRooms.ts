/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StudyRooms
// ====================================================

export interface StudyRooms_studyRooms_users {
  __typename: "User";
  id: string;
}

export interface StudyRooms_studyRooms {
  __typename: "StudyGroup";
  id: string;
  name: string;
  users: StudyRooms_studyRooms_users[];
}

export interface StudyRooms {
  studyRooms: StudyRooms_studyRooms[] | null;
}

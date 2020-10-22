/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddStudyGroup
// ====================================================

export interface AddStudyGroup_addStudyGroup {
  __typename: "StudyGroup";
  id: string;
}

export interface AddStudyGroup {
  addStudyGroup: AddStudyGroup_addStudyGroup;
}

export interface AddStudyGroupVariables {
  uids: string[];
  isPublic: boolean;
  groupName: string;
}

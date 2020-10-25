/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRootAssessmentPage
// ====================================================

export interface GetRootAssessmentPage_course_assessmentPage {
  __typename: "FolderNode";
  id: string;
}

export interface GetRootAssessmentPage_course {
  __typename: "Course";
  id: string;
  assessmentPage: GetRootAssessmentPage_course_assessmentPage;
}

export interface GetRootAssessmentPage {
  course: GetRootAssessmentPage_course;
}

export interface GetRootAssessmentPageVariables {
  courseID: string;
}

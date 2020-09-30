/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRootCoursePage
// ====================================================

export interface GetRootCoursePage_course_coursePage {
  __typename: "FolderNode";
  id: string;
  title: string;
}

export interface GetRootCoursePage_course {
  __typename: "Course";
  id: string;
  coursePage: GetRootCoursePage_course_coursePage;
}

export interface GetRootCoursePage {
  course: GetRootCoursePage_course;
}

export interface GetRootCoursePageVariables {
  courseID: string;
}

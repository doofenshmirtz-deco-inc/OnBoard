/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRootCoursePage
// ====================================================

export interface GetRootCoursePage_course_coursePage_children_TextNode {
  __typename: "TextNode";
  id: string;
  title: string;
  text: string;
}

export interface GetRootCoursePage_course_coursePage_children_HeadingNode {
  __typename: "HeadingNode";
  id: string;
  title: string;
}

export interface GetRootCoursePage_course_coursePage_children_FolderNode {
  __typename: "FolderNode";
  id: string;
  title: string;
}

export type GetRootCoursePage_course_coursePage_children = GetRootCoursePage_course_coursePage_children_TextNode | GetRootCoursePage_course_coursePage_children_HeadingNode | GetRootCoursePage_course_coursePage_children_FolderNode;

export interface GetRootCoursePage_course_coursePage {
  __typename: "FolderNode";
  id: string;
  title: string;
  children: GetRootCoursePage_course_coursePage_children[];
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

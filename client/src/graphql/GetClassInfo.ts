/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Semesters } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetClassInfo
// ====================================================

export interface GetClassInfo_me_courses_course {
  __typename: "Course";
  id: string;
  name: string;
  code: string;
  year: number;
  semester: Semesters;
}

export interface GetClassInfo_me_courses {
  __typename: "CourseColor";
  course: GetClassInfo_me_courses_course;
}

export interface GetClassInfo_me {
  __typename: "User";
  courses: GetClassInfo_me_courses[];
}

export interface GetClassInfo {
  me: GetClassInfo_me | null;
}

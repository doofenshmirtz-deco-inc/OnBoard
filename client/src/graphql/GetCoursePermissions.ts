/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCoursePermissions
// ====================================================

export interface GetCoursePermissions_me_coursesCoordinator_course {
  __typename: "Course";
  id: string;
}

export interface GetCoursePermissions_me_coursesCoordinator {
  __typename: "CourseColor";
  course: GetCoursePermissions_me_coursesCoordinator_course;
}

export interface GetCoursePermissions_me_coursesTutor_course {
  __typename: "Course";
  id: string;
}

export interface GetCoursePermissions_me_coursesTutor {
  __typename: "CourseColor";
  course: GetCoursePermissions_me_coursesTutor_course;
}

export interface GetCoursePermissions_me_coursesStudent_course {
  __typename: "Course";
  id: string;
}

export interface GetCoursePermissions_me_coursesStudent {
  __typename: "CourseColor";
  course: GetCoursePermissions_me_coursesStudent_course;
}

export interface GetCoursePermissions_me {
  __typename: "User";
  coursesCoordinator: GetCoursePermissions_me_coursesCoordinator[];
  coursesTutor: GetCoursePermissions_me_coursesTutor[];
  coursesStudent: GetCoursePermissions_me_coursesStudent[];
}

export interface GetCoursePermissions {
  me: GetCoursePermissions_me | null;
}

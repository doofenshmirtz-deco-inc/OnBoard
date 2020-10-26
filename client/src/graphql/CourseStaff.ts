/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStaff
// ====================================================

export interface CourseStaff_course_staff {
  __typename: "User";
  name: string;
  avatar: string;
}

export interface CourseStaff_course {
  __typename: "Course";
  staff: CourseStaff_course_staff[];
}

export interface CourseStaff {
  course: CourseStaff_course;
}

export interface CourseStaffVariables {
  id?: string | null;
}

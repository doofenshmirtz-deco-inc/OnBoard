/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_courses_course {
  __typename: "Course";
  name: string;
  id: string;
}

export interface Me_me_courses {
  __typename: "CourseColor";
  colour: string;
  course: Me_me_courses_course;
}

export interface Me_me {
  __typename: "User";
  name: string;
  avatar: string;
  courses: Me_me_courses[];
}

export interface Me {
  me: Me_me | null;
}

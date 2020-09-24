/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyClasses
// ====================================================

export interface MyClasses_me_courses_course {
  __typename: "Course";
  name: string;
  code: string;
}

export interface MyClasses_me_courses {
  __typename: "CourseColor";
  colour: string;
  course: MyClasses_me_courses_course;
}

export interface MyClasses_me {
  __typename: "User";
  courses: MyClasses_me_courses[];
}

export interface MyClasses {
  me: MyClasses_me | null;
}

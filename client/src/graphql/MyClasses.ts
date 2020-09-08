/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyClasses
// ====================================================

export interface MyClasses_me_courseColors_course {
  __typename: "Course";
  name: string;
}

export interface MyClasses_me_courseColors {
  __typename: "CourseColor";
  colour: string;
  course: MyClasses_me_courseColors_course;
}

export interface MyClasses_me {
  __typename: "User";
  courseColors: MyClasses_me_courseColors[];
}

export interface MyClasses {
  me: MyClasses_me | null;
}

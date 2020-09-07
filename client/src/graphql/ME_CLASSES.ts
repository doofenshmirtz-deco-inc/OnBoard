/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ME_CLASSES
// ====================================================

export interface ME_CLASSES_me_courseColors_course {
  __typename: "Course";
  name: string;
}

export interface ME_CLASSES_me_courseColors {
  __typename: "CourseColor";
  colour: string;
  course: ME_CLASSES_me_courseColors_course;
}

export interface ME_CLASSES_me {
  __typename: "User";
  courseColors: ME_CLASSES_me_courseColors[];
}

export interface ME_CLASSES {
  me: ME_CLASSES_me | null;
}

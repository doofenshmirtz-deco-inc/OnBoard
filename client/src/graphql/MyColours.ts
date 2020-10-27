/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyColours
// ====================================================

export interface MyColours_me_courses_course {
  __typename: "Course";
  code: string;
}

export interface MyColours_me_courses {
  __typename: "CourseColor";
  colour: string;
  course: MyColours_me_courses_course;
}

export interface MyColours_me {
  __typename: "User";
  courses: MyColours_me_courses[];
}

export interface MyColours {
  me: MyColours_me | null;
}

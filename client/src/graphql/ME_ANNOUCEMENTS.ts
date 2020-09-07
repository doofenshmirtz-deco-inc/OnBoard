/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ME_ANNOUCEMENTS
// ====================================================

export interface ME_ANNOUCEMENTS_me_courseColors_course_announcements {
  __typename: "Announcement";
  createdAt: any;
  html: string;
  title: string;
}

export interface ME_ANNOUCEMENTS_me_courseColors_course {
  __typename: "Course";
  announcements: ME_ANNOUCEMENTS_me_courseColors_course_announcements[] | null;
}

export interface ME_ANNOUCEMENTS_me_courseColors {
  __typename: "CourseColor";
  colour: string;
  course: ME_ANNOUCEMENTS_me_courseColors_course;
}

export interface ME_ANNOUCEMENTS_me {
  __typename: "User";
  courseColors: ME_ANNOUCEMENTS_me_courseColors[];
}

export interface ME_ANNOUCEMENTS {
  me: ME_ANNOUCEMENTS_me | null;
}

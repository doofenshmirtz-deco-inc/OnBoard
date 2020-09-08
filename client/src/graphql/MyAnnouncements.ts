/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyAnnouncements
// ====================================================

export interface MyAnnouncements_me_courseColors_course_announcements {
  __typename: "Announcement";
  createdAt: any;
  html: string;
  title: string;
}

export interface MyAnnouncements_me_courseColors_course {
  __typename: "Course";
  announcements: MyAnnouncements_me_courseColors_course_announcements[] | null;
}

export interface MyAnnouncements_me_courseColors {
  __typename: "CourseColor";
  colour: string;
  course: MyAnnouncements_me_courseColors_course;
}

export interface MyAnnouncements_me {
  __typename: "User";
  courseColors: MyAnnouncements_me_courseColors[];
}

export interface MyAnnouncements {
  me: MyAnnouncements_me | null;
}

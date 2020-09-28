/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyCalendar
// ====================================================

export interface MyCalendar_me_groups_CourseGroup {
  __typename: "CourseGroup" | "DMGroup" | "StudyGroup";
}

export interface MyCalendar_me_groups_ClassGroup_timetable {
  __typename: "Timetable";
  id: string;
  name: string;
  times: any[];
  duration: number;
}

export interface MyCalendar_me_groups_ClassGroup {
  __typename: "ClassGroup";
  id: string;
  name: string;
  timetable: MyCalendar_me_groups_ClassGroup_timetable | null;
}

export type MyCalendar_me_groups =
  | MyCalendar_me_groups_CourseGroup
  | MyCalendar_me_groups_ClassGroup;

export interface MyCalendar_me {
  __typename: "User";
  groups: MyCalendar_me_groups[];
}

export interface MyCalendar {
  me: MyCalendar_me | null;
}

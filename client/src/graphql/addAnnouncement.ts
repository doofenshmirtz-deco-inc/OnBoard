/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addAnnouncement
// ====================================================

export interface addAnnouncement_addAnnouncement {
  __typename: "Announcement";
  id: string;
}

export interface addAnnouncement {
  addAnnouncement: addAnnouncement_addAnnouncement;
}

export interface addAnnouncementVariables {
  courseID: string;
  title: string;
  html: string;
}

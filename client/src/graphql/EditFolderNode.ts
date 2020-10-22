/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditFolderNode
// ====================================================

export interface EditFolderNode_editFolderNode_parent {
  __typename: "FolderNode";
  id: string;
  title: string;
}

export interface EditFolderNode_editFolderNode {
  __typename: "FolderNode";
  id: string;
  title: string;
  parent: EditFolderNode_editFolderNode_parent | null;
}

export interface EditFolderNode {
  editFolderNode: EditFolderNode_editFolderNode;
}

export interface EditFolderNodeVariables {
  id?: number | null;
  title?: string | null;
  parent?: number | null;
}

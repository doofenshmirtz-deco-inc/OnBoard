/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditTextNode
// ====================================================

export interface EditTextNode_editTextNode_parent {
  __typename: "FolderNode";
  id: string;
}

export interface EditTextNode_editTextNode {
  __typename: "TextNode";
  id: string;
  title: string;
  text: string;
  parent: EditTextNode_editTextNode_parent | null;
  link: string | null;
}

export interface EditTextNode {
  editTextNode: EditTextNode_editTextNode;
}

export interface EditTextNodeVariables {
  id?: number | null;
  title?: string | null;
  link?: string | null;
  parent?: number | null;
  text?: string | null;
}

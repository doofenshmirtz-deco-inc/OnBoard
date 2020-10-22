/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTextNode
// ====================================================

export interface AddTextNode_textNode_parent {
  __typename: "FolderNode";
  id: string;
}

export interface AddTextNode_textNode {
  __typename: "TextNode";
  id: string;
  title: string;
  text: string;
  parent: AddTextNode_textNode_parent | null;
  link: string | null;
}

export interface AddTextNode {
  textNode: AddTextNode_textNode;
}

export interface AddTextNodeVariables {
  title: string;
  parent: number;
  text: string;
  link: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNode
// ====================================================

export interface GetNode_node_TextNode_parent {
  __typename: "FolderNode";
  id: string;
}

export interface GetNode_node_TextNode {
  __typename: "TextNode";
  id: string;
  title: string;
  text: string;
  parent: GetNode_node_TextNode_parent | null;
}

export interface GetNode_node_HeadingNode_parent {
  __typename: "FolderNode";
  id: string;
}

export interface GetNode_node_HeadingNode {
  __typename: "HeadingNode";
  id: string;
  title: string;
  parent: GetNode_node_HeadingNode_parent | null;
}

export interface GetNode_node_FolderNode_parent {
  __typename: "FolderNode";
  id: string;
}

export interface GetNode_node_FolderNode_children_TextNode {
  __typename: "TextNode";
  id: string;
  title: string;
  text: string;
}

export interface GetNode_node_FolderNode_children_HeadingNode {
  __typename: "HeadingNode";
  id: string;
  title: string;
}

export interface GetNode_node_FolderNode_children_FolderNode {
  __typename: "FolderNode";
  id: string;
  title: string;
}

export type GetNode_node_FolderNode_children = GetNode_node_FolderNode_children_TextNode | GetNode_node_FolderNode_children_HeadingNode | GetNode_node_FolderNode_children_FolderNode;

export interface GetNode_node_FolderNode {
  __typename: "FolderNode";
  id: string;
  title: string;
  parent: GetNode_node_FolderNode_parent | null;
  children: GetNode_node_FolderNode_children[];
}

export type GetNode_node = GetNode_node_TextNode | GetNode_node_HeadingNode | GetNode_node_FolderNode;

export interface GetNode {
  node: GetNode_node | null;
}

export interface GetNodeVariables {
  nodeID: number;
}

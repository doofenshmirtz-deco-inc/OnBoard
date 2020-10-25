/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteNode
// ====================================================

export interface DeleteNode_deleteNode {
  __typename: "BaseNode";
  link: string | null;
}

export interface DeleteNode {
  deleteNode: DeleteNode_deleteNode;
}

export interface DeleteNodeVariables {
  nodeId: number;
}

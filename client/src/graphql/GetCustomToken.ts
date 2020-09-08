/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCustomToken
// ====================================================

export interface GetCustomToken_getCustomToken {
  __typename: "AuthToken";
  token: string;
}

export interface GetCustomToken {
  getCustomToken: GetCustomToken_getCustomToken;
}

export interface GetCustomTokenVariables {
  uid: string;
}

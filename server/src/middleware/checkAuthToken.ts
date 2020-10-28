/**
 * Checks the given auth token with firebase.
 */

import admin from "firebase-admin";

// checks the given auth token with firebase. returns decoded token if success
// or throws on failure.
export const checkAuthToken = async (authorization: string | undefined) => {
  if (!authorization) {
    throw new Error("No authentification header");
  }

  try {
    return await admin.auth().verifyIdToken(authorization);
  } catch (err) {
    throw new Error("Not authenticated");
  }
};

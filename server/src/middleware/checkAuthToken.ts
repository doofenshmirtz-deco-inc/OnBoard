/**
 * Verifies that the auth token is well-defined and is valid
 */
import admin from "firebase-admin";

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

/**
 * Verify the user is authorized and update the context with the UID
 */
import { AuthChecker } from "type-graphql";
import { Context } from "vm";
import { checkAuthToken } from "./checkAuthToken";

export const authChecker: AuthChecker<Context> = async ({ context }) => {
  const authorization =
    context.auth ??
    (context.req
      ? context.req.headers.authorization
      : context.connection.context.authorization);

  // Get username from email
  const decoded = await checkAuthToken(authorization);
  context.payload = {
    uid: decoded.email ? decoded.email?.split("@")[0] : decoded.uid,
  };
  return true;
};

/**
 * Checks the authorisation from the request context. Context may come from
 * various places, so we need to check all of those. Sets the uid onto the 
 * payload.
 */

import { AuthChecker } from "type-graphql";
import { Context } from "vm";
import { checkAuthToken } from "./checkAuthToken";

// check the authorisation from the context object.
export const authChecker: AuthChecker<Context> = async ({ context }) => {
  // authorization may be found in 3 places:
  // - context.auth which is populated from the webhook subscription handler
  // - context.req.headers from the request
  // - context.connection.context from the connection's context
  const authorization =
    context.auth ??
    (context.req
      ? context.req.headers.authorization
      : context.connection.context.authorization);

  // check authorisation token with firebase
  const decoded = await checkAuthToken(authorization);

  // get "username" from the email.
  context.payload = {
    uid: decoded.email ? decoded.email?.split("@")[0] : decoded.uid,
  };
  return true;
};

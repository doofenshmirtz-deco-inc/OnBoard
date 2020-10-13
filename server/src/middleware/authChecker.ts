import { AuthChecker } from "type-graphql";
import { Context } from "vm";
import { checkAuthToken } from "./checkAuthToken";

export const authChecker: AuthChecker<Context> = async ({ context }) => {
  const authorization = context.req
    ? context.req.headers.authorization
    : context.connection.context.authorization;
  // Get username from email
  context.payload = {
    uid: (await checkAuthToken(authorization)).email?.split("@")[0],
  };
  return true;
};

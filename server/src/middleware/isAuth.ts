import { MiddlewareFn, ResolverData } from "type-graphql";
import { Context, Payload } from "./Context";
import admin from "firebase-admin";
import { checkAuthToken } from "./checkAuthToken";

export const isAuth: MiddlewareFn<Context> = async (
  data: ResolverData<Context>,
  next
) => {
  const authorization = data.context.req.headers["authorization"];

  data.context.payload = { uid: (await checkAuthToken(authorization)).uid }; //payload as any;

  return next();
};

import { MiddlewareFn, ResolverData } from "type-graphql";
import { Context, Payload } from "./Context";
import {checkAuthToken} from "./checkAuthToken";

export const isAuthSub: MiddlewareFn<Context> = async (
  data: ResolverData<Context>,
  next
) => {
  console.log(data.context);
  const authorization = data.context.connection.context.authorization;

  data.context.payload = { uid: (await checkAuthToken(authorization)).uid }; //payload as any;
  return next();
};

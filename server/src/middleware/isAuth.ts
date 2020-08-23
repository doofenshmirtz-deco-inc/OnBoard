import { MiddlewareFn, ResolverData } from "type-graphql";
import {Context, Payload} from "./Context";
import admin from "firebase-admin";

export const isAuth: MiddlewareFn<Context> = async (data: ResolverData<Context>, next) => {
  console.log(data.context.req.headers);
  const authorization = data.context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("No authentification header");
  }

  try {
    // const token = authorization.split(" ")[1];

	const token = await admin.auth().verifyIdToken(authorization);
	console.log(token);

    // const payload = verify(token, "MySecretKey");
    data.context.payload = { uid: token.uid }; //payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};

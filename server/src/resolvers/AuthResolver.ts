import { Resolver, Query, Arg } from "type-graphql";
import admin from "firebase-admin";
import { AuthToken } from "../models/Auth";

import * as firebase from "firebase/app";
import "firebase/auth";
import { User } from "../models/User";

@Resolver()
export class AuthResolver {
  @Query(() => AuthToken)
  async getTestingToken(
    @Arg("testUID", { defaultValue: "test-uid" }) testUID: string
  ): Promise<AuthToken> {
    if (process.env.NODE_ENV !== "development")
      throw new Error("Only availible in development");
    let customToken = await admin.auth().createCustomToken(testUID);

    let user = await firebase.auth().signInWithCustomToken(customToken);
    if (!user.user) throw new Error("Invalid user from firebase");

    let token = await user.user.getIdToken();

    return {
      token,
    };
  }
}

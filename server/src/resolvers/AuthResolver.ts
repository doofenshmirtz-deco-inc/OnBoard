import { Resolver, Query, Arg } from "type-graphql";
import admin from "firebase-admin";
import { AuthToken } from "../models/Auth";

import * as firebase from "firebase/app";
import "firebase/auth";

@Resolver()
export class AuthResolver {
  @Query(() => AuthToken)
  async getTestingToken(
    @Arg("testUID", { defaultValue: "test-uid" }) testUID: string
  ): Promise<AuthToken> {
    let customToken = await admin.auth().createCustomToken(testUID);

    // TODO: this is hacky (firebase shouldnt really be on the backend)
    let user = await firebase.auth().signInWithCustomToken(customToken);
    if (!user.user) throw new Error("Invalid user from firebase");

    let token = await user.user.getIdToken();

    return {
      token,
    };
  }

  @Query(() => AuthToken)
  async getCustomToken(
    @Arg("testUID", { defaultValue: "test-uid" }) testUID: string
  ): Promise<AuthToken> {
    let token = await admin.auth().createCustomToken(testUID);

    return {
      token,
    };
  }
}

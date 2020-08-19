import {Resolver, Query} from "type-graphql";
import admin from "firebase-admin";
import {User} from "../models/User";
import {AuthToken} from "../models/Auth";

import * as firebase from "firebase/app";
import "firebase/auth";



@Resolver()
export class AuthResolver {
	@Query(() => AuthToken)
	async getTestingToken(): Promise<AuthToken> {
		const testUID = "test-uid";

		let customToken = await admin.auth().createCustomToken(testUID);

		// TODO: this is hacky (firebase shouldnt really be on the backend)
		let user = await firebase.auth().signInWithCustomToken(customToken);
		if (!user.user) throw new Error("Invalid user from firebase");

		let token = await user.user.getIdToken();


		return {
			token
		}
	}
}

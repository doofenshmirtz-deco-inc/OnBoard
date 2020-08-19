import {Resolver, Query} from "type-graphql";
import admin from "firebase-admin";
import {User} from "../models/User";
import {AuthToken} from "../models/Auth";


@Resolver()
export class AuthResolver {
	@Query(() => AuthToken)
	async getTestingToken(): Promise<AuthToken> {
		const testUID = "test-uid";

		let token = await admin.auth().createCustomToken(testUID);

		return {
			token
		}
	}
}

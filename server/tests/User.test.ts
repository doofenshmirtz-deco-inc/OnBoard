import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {graphqlTestCall} from "./GraphqlTestCall";
import {useSeeding, runSeeder} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";
import {isAuthMock} from "./isAuthMock";
import {ResolverData, NextFn, buildSchema} from "type-graphql";
import {Context} from "../src/middleware/Context";
import { createTestClient } from "apollo-server-testing";
import {ApolloServer} from "apollo-server-express";
import {UserResolver} from "../src/resolvers/UserResolver";
import {AuthResolver} from "../src/resolvers/AuthResolver";
import {CourseResolver} from "../src/resolvers/CourseResolver";

let uid = "test-uid";
let query: any;
let mutate: any;

/* TODO this is broken
jest.mock("../src/middleware/isAuth", () => ({
	__esModule: true,
	isAuth: jest.fn((data: ResolverData<Context>, next: NextFn) => isAuthMock(
		{
			context: {
			}
		},	
		next, 
		uid
	)),
}));
*/

const getUserQuery = `
	query {
		user (id: "doof-uid") {
			name
		}
	}
`;

const getUsersQuery = `
	query {
		users {
			name
		}
	}
`;


const meQuery = `
	query {
		me {
			name
		}
	}
`;


let connection: Connection;

beforeAll(async () => {
	connection = await createTestConnection();
	await useSeeding();
	await runSeeder(UserSeeder);
});


afterAll(async () => {
	await connection.close();
});

describe("User Resolver", () => {
	it("user query", async () => {
		const user = await graphqlTestCall(getUserQuery);

		expect(user.data?.user.name).toBe('Heinz Doofenshmirtz');
		expect(user.data?.user.email).toBeUndefined();
	});

	it("users query", async () => {
		// TODO test properly when there is actual data/auth
		uid = "test-uid";	

		const users = await graphqlTestCall(getUsersQuery);
	});


	/*
	it("users query", async () => {
		uid = "doof-uid";	

		const me = await graphqlTestCall(meQuery);

		expect(me.data?.name).toBe('Heinz Doofenshmitz');
	});
	*/
});







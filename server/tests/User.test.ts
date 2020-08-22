import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {graphqlTestCall} from "./GraphqlTestCall";
import {useSeeding, runSeeder} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";
import {isAuthMock} from "./isAuthMock";
import {ResolverData, NextFn} from "type-graphql";
import {Context} from "../src/middleware/Context";

let uid = "test-uid";

/* TODO this is currently broken
jest.mock("../src/middleware/isAuth", () => ({
	__esModule: true,
	isAuth: jest.fn((data: ResolverData<Context>, next: NextFn) => isAuthMock(data, next, uid)),
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
		// TODO test properly when there is actual 
		uid = "test-uid";	

		const users = await graphqlTestCall(getUsersQuery);
	});


	it("users query", async () => {
		uid = "doof-uid";	

		const me = await graphqlTestCall(meQuery);
		console.log(me);
		expect(me.data?.name).toBe('Heinz Doofenshmitz');
	});
});







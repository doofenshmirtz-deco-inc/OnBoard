import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {graphqlTestCall} from "./GraphqlTestCall";
import {useSeeding, runSeeder} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";

jest.mock("../src/middleware/isAuth", () => ({
	__esModule: true,
	isAuth: jest.fn(() => console.log("isAuth isn't implemented"))
}));


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


let connection: Connection;

beforeAll(async () => {
	connection = await createTestConnection();
	await useSeeding();
	await runSeeder(UserSeeder);
});


afterAll(async () => {
	await connection.close();
});

const setup = (overrides: any) => {
	
};


describe("User Resolver", () => {
	it("user query", async () => {
		const user = await graphqlTestCall(getUserQuery);

		expect(user.data?.user.name).toBe('Heinz Doofenshmirtz');
		expect(user.data?.user.email).toBeUndefined();
	});

	it("users query", async () => {
		const users = await graphqlTestCall(getUsersQuery);
	});
});







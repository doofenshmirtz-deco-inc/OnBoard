import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {graphqlTestCall} from "./GraphqlTestCall";
import {useSeeding, runSeeder} from "typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";


const getUserQuery = `
	query {
		user (id: "doof-uid") {
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
});

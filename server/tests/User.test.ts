import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {useSeeding, runSeeder} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";
import {UserResolver} from "../src/resolvers/UserResolver";
import CourseSeeder from "../src/db/seeds/CourseSeeder";
import TestingUserSeeder from "../src/db/seeds/TestDataSeeder";


const userResolver = new UserResolver();
const emptyReqRes = { 
	req: {} as any,
	res: {} as any,
	connection: {} as any
};

let connection: Connection;

beforeAll(async () => {
	connection = await createTestConnection();
	await useSeeding();
	await runSeeder(UserSeeder);
	await runSeeder(CourseSeeder);
	await runSeeder(TestingUserSeeder);
});


afterAll(async () => {
	await connection.close();
});

describe("User Resolver", () => {
	it("user query", async () => {
		const user = await userResolver.user("doof-uid");
		if (!user) fail("user is not defined");

		expect(user.name).toBe('Heinz Doofenshmirtz');
		expect(user.email).toBe('heinz@evilinc.com');
	});

	it("users query", async () => {
		let users = await userResolver.users({
			orderBy: 'name',
			order: 'DESC'
		});;
		expect(users[0].name.localeCompare(users[1].name)).toBe(1);


		users = await userResolver.users({
			orderBy: 'id',
			order: 'ASC',
			limit: 3,
		});;

		expect(users.length).toBe(3);
		expect(users[0].id.localeCompare(users[1].id)).toBe(-1);
	});

	it("me query", async () => {
		const user = await userResolver.me({
			...emptyReqRes,
			payload: {
				uid: "doof-uid"
			}
		});
		if (!user) fail("user is not defined");

		expect(user.name).toBe('Heinz Doofenshmirtz');
		expect(user.email).toBe('heinz@evilinc.com');
	});
});







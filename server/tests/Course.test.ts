import {Connection, getConnection} from "typeorm";
import {createTestConnection} from "./TestDatabase";
import {useSeeding, runSeeder} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";
import CourseSeeder from "../src/db/seeds/CourseSeeder";
import TestingUserSeeder from "../src/db/seeds/TestingUserSeeder";
import {CourseResolver} from "../src/resolvers/CourseResolver";
import {Semesters} from "../src/models/Course";


const courseResolver = new CourseResolver();
const emptyReqRes = { 
	req: {} as any,
	res: {} as any
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

describe("Course Resolver", () => {
	/** TODO
	 * Try viewing course students, coordinators
	 */

	it("courses query", async () => {
		const course = await courseResolver.courses({
			order: 'DESC',
			orderBy: 'id'
		});

		expect(course.length).toBeGreaterThan(0);
		expect(course.map(course => course.id)).toContain("MATH1071");
		expect((await course[course.map(course => course.id).indexOf("MATH1071")].students.users).map(student => student.id)).toContain("doof-uid");
	});

	it("students query", async () => {
		/*
		const students = await courseResolver.courseStudents(
			{ order: "ASC", orderBy: "id" }, 
			{ id: "MATH1071", semester: Semesters.One, year: 2018 }, 
			{ ...emptyReqRes, payload: { uid: "doof-uid" }}
		)
		expect((await students?.users)?.length).toBe(1);
		*/
	});


	it("empty students query", async () => {
		try {
			await courseResolver.courseStudents(
				{ order: "ASC", orderBy: "id" }, 
				{ id: "MATH1071", semester: Semesters.One, year: 2018 }, 
				{ ...emptyReqRes, payload: { uid: "bad-uid" }}
			)
			fail();
		} catch {
			
		}
	});

});






import { Connection, getConnection } from "typeorm";
import { createTestConnection } from "./TestDatabase";
import { useSeeding, runSeeder } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import UserSeeder from "../src/db/seeds/UserSeeder";
import CourseSeeder from "../src/db/seeds/CourseSeeder";
import TestDataSeeder from "../src/db/seeds/TestDataSeeder";
import { CourseResolver } from "../src/resolvers/CourseResolver";
import { Semesters } from "../src/models/Course";
import { CourseRole } from "../src/models/CourseGroupPair";

const courseResolver = new CourseResolver();
const emptyReqRes = {
  req: {} as any,
  res: {} as any,
  connection: {} as any,
};

let connection: Connection;

beforeAll(() => {
  return (async () => {
    connection = await createTestConnection();
    await useSeeding();
    await runSeeder(TestDataSeeder);
  })();
});

afterAll(() => {
  return connection.close();
});

describe("Course Resolver", () => {
  it("courses query", async () => {
    const course = await courseResolver.courses({
      order: "DESC",
      orderBy: "id",
    });

    expect(course.length).toBeGreaterThan(0);
    expect(course.map((course) => course.code)).toContain("SECR1000");
  });
});

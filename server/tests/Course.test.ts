import { Connection, getConnection } from "typeorm";
import { createTestConnection } from "./TestDatabase";
import { useSeeding, runSeeder } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import TestDataSeeder from "../src/db/seeds/TestDataSeeder";
import { CourseResolver } from "../src/resolvers/CourseResolver";
import { Semesters, CourseLevel } from "../src/models/Course";
import { CourseRole } from "../src/models/CourseGroupPair";
import { User } from "../src/models/User";

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

  it("insert course", async () => {
    const iCourse = await courseResolver.addCourse({
      name: "Test",
      code: "TEST1234",
      year: 2020,
      semester: Semesters.One,
      courseLevel: CourseLevel.Undergrad,
      students: ["doof", "kenton"],
    });
    expect(iCourse.code).toBe("TEST1234");

    const course = await courseResolver.course(iCourse.id);

    if (!course) fail();
    expect(course!.code).toBe("TEST1234");
  });
});

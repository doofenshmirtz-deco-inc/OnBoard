import { Connection, getConnection } from "typeorm";
import { createTestConnection } from "./TestDatabase";
import { useSeeding, runSeeder } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { UserResolver } from "../src/resolvers/UserResolver";
import TestDataSeeder from "../src/db/seeds/TestDataSeeder";
import { AnnouncementResolver } from "../src/resolvers/AnnouncementResolver";
import { CourseResolver } from "../src/resolvers/CourseResolver";
import { Course } from "../src/models/Course";

const emptyReqRes = {
  req: {} as any,
  res: {} as any,
  connection: {} as any,
};

let connection: Connection;
let userResolver: UserResolver;

const annoucementResolver = new AnnouncementResolver();
const courseResolver = new CourseResolver();

beforeAll(async () => {
  connection = await createTestConnection();
  userResolver = new UserResolver();
  await useSeeding();
  await runSeeder(TestDataSeeder);
});

afterAll(async () => {
  await getConnection().close();
});

describe("Announcements Resolver", () => {
  it("add query", async (done) => {
    const course = await Course.findOne({ code: "SECR1000" });
    if (!course) fail();

    annoucementResolver.addAnnouncement(
      {
        title: "Test Title",
        html: "Test Text",
        courseID: course!.id,
      },
      {
        ...emptyReqRes,
        payload: {
          uid: "tom",
        },
      }
    );

    const ann = (await courseResolver.course(course.id))!.announcements[0];
    expect(ann.title).toBe("Test Title");
    expect(ann.html).toBe("Test Text");
  });
});

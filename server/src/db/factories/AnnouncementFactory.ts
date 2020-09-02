import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { UserGroup } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { User } from "../../models/User";

define(Announcement, async (
  faker: typeof Faker,
  ctx?: { course: Course; authors: User[] }
) => {
  if (ctx == null || ctx.authors == null || ctx.authors.length == 0)
    throw new Error(
      "Announcement factory must be given context with course and users"
    );

  const announcement = new Announcement();
  announcement.html = faker.lorem.paragraph();
  announcement.title = faker.lorem.words();
  announcement.author = Promise.resolve(faker.random.arrayElement(ctx.authors));

  return announcement;
});

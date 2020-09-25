import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { BaseGroup } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { User } from "../../models/User";

define(Announcement, async (faker, ctx?: { authors: User[] }) => {
  if (ctx == null || ctx.authors == null || ctx.authors.length == 0)
    throw new Error(
      "Announcement factory must be given context with author users"
    );

  const announcement = new Announcement();
  announcement.html = faker.lorem.paragraph();
  announcement.title = faker.lorem.words();
  announcement.author = faker.random.arrayElement(ctx.authors);

  return announcement;
});

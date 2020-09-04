import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { BaseGroup, CourseGroup } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { CourseGroupPair, CourseRole } from "../../models/CourseGroupPair";

export type CourseFactoryContext = {
  groups?: {
    [role: string]: CourseGroup;
  };
};

define(Course, async (faker: typeof Faker, context?: CourseFactoryContext) => {
  const subject = faker.random.arrayElement(["MATH", "CSSE", "COMP", "STAT"]);
  const code = faker.random.number({ min: 1000, max: 4999, precision: 1 });

  const course = new Course();
  course.code = `${subject}${code}`;
  course.name = faker.lorem.sentence(4);
  course.year = faker.random.number({ min: 2017, max: 2022, precision: 1 });
  course.semester = faker.random.number() % 2 ? Semesters.One : Semesters.Two;
  course.courseLevel =
    faker.random.number() % 3 ? CourseLevel.Postgrad : CourseLevel.Undergrad;

  if (context?.groups) {
    for (const [role, group] of Object.entries(context.groups)) {
      course.addGroup(role as CourseRole, group);
    }
  }

  const authors = context?.groups?.[CourseRole.Coordinator];
  if (authors) {
    course.announcements = factory(Announcement)({
      course,
      authors,
    }).createMany(faker.random.number(10));
  }

  return course;
});

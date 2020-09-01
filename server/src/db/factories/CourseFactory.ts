import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { UserGroup } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";

define(Course, async (faker: typeof Faker) => {
  const subject = faker.random.arrayElement(["MATH", "CSSE", "COMP", "STAT"]);
  const code = faker.random.number({ min: 1000, max: 4999, precision: 1 });

  const course = new Course();
  course.id = `${subject}${code}`;
  course.name = faker.lorem.sentence(4);
  course.year = faker.random.number({ min: 2017, max: 2022, precision: 1 });
  course.semester = faker.random.number() % 2 ? Semesters.One : Semesters.Two;
  course.courseLevel =
    faker.random.number() % 3 ? CourseLevel.Postgrad : CourseLevel.Undergrad;
  course.coordinators = await factory(UserGroup)({
    num: faker.random.number({ min: 1, max: 3, precision: 1 }),
  }).create();
  course.tutors = await factory(UserGroup)({
    num: faker.random.number({ min: 2, max: 8, precision: 1 }),
  }).create();
  course.students = await factory(UserGroup)({
    num: faker.random.number({ min: 10, max: 30, precision: 1 }),
  }).create();

  const authors = await course.coordinators.users;
  course.announcements = factory(Announcement)({ course, authors }).createMany(
    faker.random.number(10)
  );

  return course;
});

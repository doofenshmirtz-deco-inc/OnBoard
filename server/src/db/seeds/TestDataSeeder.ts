import {
  Seeder,
  Factory,
  factory,
} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { Semesters, CourseLevel, Course } from "../../models/Course";
import { BaseGroup, GroupType, CourseGroup } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { CourseRole } from "../../models/CourseGroupPair";

// const generateEmptyGroup = (context?: {type: GroupType}) =>
//   BaseGroup.create({ users: Promise.resolve([]), type: context?.type ?? GroupType.CourseStudents }).save();

/**
 * Generates a user for test (e.g. the user is enrolled in a course)
 */
const generateTestUser = async (
  context:
    | {
        uid: string;
        name: string;
        email: string;
      }
    | undefined
) => {
  if (!context) throw new Error("TestUserFactory requires context");

  return User.create({
    id: context.uid,
    name: context.name,
    email: context.email,
  }).save();
};

const generateTestCourse = async (
  context: { code: string; name: string; semester: Semesters; year: number },
  userContext?: { user: User; role: CourseRole }
) => {
  const course = Course.create({
    ...context,
    courseLevel: CourseLevel.Undergrad,
  });

  if (userContext?.role)
    await course.addGroup(
      userContext?.role,
      await factory(CourseGroup)({ users: [userContext.user] }).create()
    );

  return course.save();
};

const generateTestAnnouncements = async (
  context: { course: Course; author: User },
  texts: string[]
) => {
  let i = 0;

  for (const text of texts) {
    await Announcement.create({
      course: context.course,
      title: context.course.code + " Announcement " + i,
      author: context.author,
      html: text,
    }).save();
    i++;
  }
};

export default class TestDataSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const heinz = await generateTestUser({
      uid: "doof-uid",
      name: "Heinz Doofenshmirtz",
      email: "heinz@evilinc.com",
    });

    const math1071 = await generateTestCourse(
      {
        code: "MATH1071",
        name: "Advanced Calculus and Linear Algebra I",
        semester: Semesters.One,
        year: 2018,
      },
      {
        user: heinz,
        role: CourseRole.Coordinator,
      }
    );

    const bad = await generateTestUser({
      uid: "bad-uid",
      name: "Bad User",
      email: "bad@bad.bad",
    });

    const badCourse = await generateTestCourse(
      {
        code: "Bad Course",
        name: "A really bad course",
        semester: Semesters.One,
        year: 2018,
      },
      {
        user: bad,
        role: CourseRole.Student,
      }
    );

    await generateTestAnnouncements(
      {
        course: math1071,
        author: heinz,
      },
      ["test announcement text"]
    );
  }
}

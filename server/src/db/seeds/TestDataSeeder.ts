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
import Faker from "faker";

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
  userContext: { users: User[]; role: CourseRole }
) => {
  const course = await Course.create({
    ...context,
    courseLevel: CourseLevel.Undergrad,
  }).save();

  if (userContext?.role)
    await course.addGroup(
      userContext?.role,
      await factory(CourseGroup)({ users: userContext.users }).create()
    );

  return course;
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
      createdAt: Faker.date.past(1, new Date(Date.now())),
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

    const perry = await generateTestUser({
      uid: "perry-uid",
      name: "Perry The Platypus",
      email: "perry@evilinc.com",
    });

    const math1071 = await generateTestCourse(
      {
        code: "MATH1071",
        name: "Advanced Calculus and Linear Algebra I",
        semester: Semesters.One,
        year: 2018,
      },
      {
        users: [heinz],
        role: CourseRole.Coordinator,
      }
    );

    const csse2310 = await generateTestCourse(
      {
        code: "CSSE2310",
        name: "Computer Systems Principles and Programming",
        semester: Semesters.Two,
        year: 2019,
      },
      {
        users: [heinz, perry],
        role: CourseRole.Student,
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
        users: [bad],
        role: CourseRole.Student,
      }
    );

    await generateTestAnnouncements(
      {
        course: math1071,
        author: heinz,
      },
      [
        "test announcement text",
        "aaaa bbbb",
        "There are no more classes info because I don't feel like turning up info here http://google.com.au",
      ]
    );

    await generateTestAnnouncements(
      {
        course: csse2310,
        author: heinz,
      },
      ["Good luck hope you don't fail :)", "Bomb goes boom!"]
    );
  }
}

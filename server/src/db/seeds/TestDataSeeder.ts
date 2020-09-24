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
import { FolderNode, TextNode } from "../../models/CoursePageNode";

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
  const page = await FolderNode.create({
    title: context.code,
  }).save();

  const text = TextNode.create({
    title: `Welcome to ${context.code}`,
    text: "This will be a fun course",
  });
  text.parent = Promise.resolve(page);
  await text.save();

  const course = await Course.create({
    ...context,
    courseLevel: CourseLevel.Undergrad,
    coursePage: page,
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
  let i = 1;

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

    await generateTestCourse(
      {
        code: "MATH1071",
        name: "Protecting Your Schemes from Secret Agents",
        semester: Semesters.One,
        year: 2018,
      },
      {
        users: [heinz],
        role: CourseRole.Coordinator,
      }
    );

    const math1071 = await generateTestCourse(
      {
        code: "SECR1000",
        name: "Protecting Your Schemes from Secret Agents",
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
        code: "PHFE2001",
        name: "Finding Ways to Spend Your Summer Vacation",
        semester: Semesters.Two,
        year: 2019,
      },
      {
        users: [heinz, perry],
        role: CourseRole.Student,
      }
    );

    const jingle = await generateTestCourse(
      {
        code: "EVIL3079",
        name: "Advanced Evil Jingles",
        semester: Semesters.Two,
        year: 2019,
      },
      {
        users: [heinz, perry],
        role: CourseRole.Student,
      }
    );

    await generateTestCourse(
      {
        code: "EDIS3801",
        name: "Evil Design Inventing Studio 3 - Build",
        semester: Semesters.Two,
        year: 2019,
      },
      {
        users: [heinz],
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
        "Following the invention of the Combine-inator one may find it necassasary to protect their inventions. This course will investigate how to protect your evil inventions.",
        "There are no more classes info because I don't feel like turning up info here http://protected.evil.inc",
      ]
    );

    await generateTestAnnouncements(
      {
        course: csse2310,
        author: heinz,
      },
      [
        "Good luck hope you don't fail :)",
        "Summers vacation is a long time, heres how to spend it!!",
      ]
    );

    await generateTestAnnouncements(
      {
        course: jingle,
        author: heinz,
      },
      [
        "Doofenshmirtz Evil Incorparated!A place of evil and fighting! With Perry the Platypus too! Doofenshmirtz holding a Bucket!I don't know what it's for! Doofenshmirtz Ex-Wifes House in the Hills somewhere! Stop reminding me of her! Doofenshmirtz Wicked Witch Castle!",
        "Doofenshmirtz Evil Dirigible It's my awesome blimp! Doofenshmirtz Evil Incorparated! I don't wanna sing anymore! So we're through!",
      ]
    );
  }
}

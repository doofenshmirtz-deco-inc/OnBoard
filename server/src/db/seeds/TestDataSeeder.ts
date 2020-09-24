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
import { CourseRole, CourseGroupPair } from "../../models/CourseGroupPair";
import Faker from "faker";
import { FolderNode, TextNode } from "../../models/CoursePageNode";

// const generateEmptyGroup = (context?: {type: GroupType}) =>
//   BaseGroup.create({ users: Promise.resolve([]), type: context?.type ?? GroupType.CourseStudents }).save();

/**
 * Generates a user for test (e.g. the user is enrolled in a course)
 */
const addGroups = async (
  groups: {
    [role: string]: User[];
  },
  course: Course
) => {
  if (groups) {
    for (const [role, users] of Object.entries(groups)) {
      const group = await factory(CourseGroup)({ users }).create();
      course.addGroup(role as CourseRole, group);
    }
  }
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
    const heinz = await factory(User)({
      ui: "doof-uid",
      name: "Heinz Doofenshmirtz",
      email: "heinz@evilinc.com",
    }).create();

    const perry = await factory(User)({
      ui: "perry-uid",
      name: "Perry The Platypus",
    }).create();

    const secr = await factory(Course)({
      code: "SECR1000",
      name: "Protecting Your Schemes from Secret Agents",
      semester: Semesters.One,
      level: CourseLevel.Undergrad,
      year: 2018,
    }).create();
    addGroups({ [CourseRole.Coordinator]: [heinz] }, secr);

    const phfe = await factory(Course)({
      code: "PHFE2001",
      name: "Finding Ways to Spend Your Summer Vacation",
      semester: Semesters.Two,
      level: CourseLevel.Undergrad,
      year: 2019,
    }).create();
    addGroups({ [CourseRole.Student]: [heinz, perry] }, phfe);

    const evil = await factory(Course)({
      code: "EVIL3079",
      name: "Advanced Evil Jingles",
      semester: Semesters.One,
      level: CourseLevel.Undergrad,
      year: 2018,
    }).create();
    addGroups({ [CourseRole.Student]: [heinz] }, evil);

    const edis = await factory(Course)({
      code: "EDIS3801",
      name: "Evil Design Inventing Studio 3 - Build",
      semester: Semesters.One,
      level: CourseLevel.Undergrad,
      year: 2018,
    }).create();
    addGroups({ [CourseRole.Student]: [heinz, perry] }, edis);

    await generateTestAnnouncements(
      {
        course: secr,
        author: heinz,
      },
      [
        "Following the invention of the Combine-inator one may find it necassasary to protect their inventions. This course will investigate how to protect your evil inventions.",
        "There are no more classes info because I don't feel like turning up info here http://protected.evil.inc",
      ]
    );

    await generateTestAnnouncements(
      {
        course: phfe,
        author: heinz,
      },
      [
        "Good luck hope you don't fail :)",
        "Summers vacation is a long time, heres how to spend it!!",
      ]
    );

    await generateTestAnnouncements(
      {
        course: evil,
        author: heinz,
      },
      [
        "Doofenshmirtz Evil Incorparated!A place of evil and fighting! With Perry the Platypus too! Doofenshmirtz holding a Bucket!I don't know what it's for! Doofenshmirtz Ex-Wifes House in the Hills somewhere! Stop reminding me of her! Doofenshmirtz Wicked Witch Castle!",
        "Doofenshmirtz Evil Dirigible It's my awesome blimp! Doofenshmirtz Evil Incorparated! I don't wanna sing anymore! So we're through!",
      ]
    );
  }
}

import {
  Seeder,
  Factory,
  factory,
} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { Semesters, CourseLevel, Course } from "../../models/Course";
import {
  BaseGroup,
  GroupType,
  CourseGroup,
  DMGroup,
  ClassGroup,
  ClassType,
} from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { CourseRole, CourseGroupPair } from "../../models/CourseGroupPair";
import { Timetable } from "../../models/Timetable";
import { Message } from "../../models/Message";
import Faker from "faker";

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

const generateDMs = async (users: User[]) => {
  const pairs = ([] as User[][]).concat(
    ...users.map((u1, i1) => users.slice(i1 + 1).map((u2) => [u1, u2]))
  );

  const groups = pairs.map(
    async (pair) => await factory(DMGroup)({ users: pair }).create()
  );

  //groups.forEach((group) => factory(Message)({ group: group }).createMany(1));

 const generateTestClass = async (
  context: { name: string; type: ClassType; course: Course },
  userContext: { users: User[] }
) => {
  const classGroup = ClassGroup.create({
    name: context.name,
    type: context.type,
    course: context.course,
  }).save();

  (await classGroup).setUsers(userContext.users);

  return await classGroup;
};

const generateTestTimetable = async (context: {
  classGroup: ClassGroup;
  name: string;
  times: Date[];
  duration: number;
}) => {
  const timetable = await Timetable.create({
    name: context.name,
    times: context.times,
    duration: context.duration,
    classes: Promise.resolve(context.classGroup),
  }).save();

  context.classGroup.timetable = Promise.resolve(timetable);
  await context.classGroup.save();

  return timetable;
};

export default class TestDataSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const heinz = await factory(User)({
      uid: "doof",
      name: "Heinz Doofenshmirtz",
      email: "heinz@evilinc.com",
      avatar:
        "https://vignette.wikia.nocookie.net/disney/images/4/41/DoofenshmirtzFull.jpg/revision/latest?cb=20190819173522",
    }).create();

    const perry = await factory(User)({
      uid: "perry",
      name: "Perry the Platypus",
    }).create();

    const tom = await factory(User)({
      uid: "tom",
      name: "Tom Cranitch",
    }).create();

    const kenton = await factory(User)({
      uid: "kenton",
      name: "Kenton Lam",
    }).create();

    const matt = await factory(User)({
      uid: "matt",
      name: "Matthew Low",
    }).create();

    const james = await factory(User)({
      uid: "james",
      name: "James Dearlove",
    }).create();

    const sanni = await factory(User)({
      uid: "sanni",
      name: "Sanni Bosamia",
    }).create();

    const nat = await factory(User)({
      uid: "nat",
      name: "Natalie Hong",
    }).create();

    generateDMs([heinz, perry, tom, kenton, matt, james, sanni, nat]);

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
      name: "Evil Design Inventing Studio 3 - Buidld",
      semester: Semesters.One,
      level: CourseLevel.Undergrad,
      year: 2018,
    }).create();
    addGroups(
      {
        [CourseRole.Student]: [
          heinz,
          perry,
          tom,
          kenton,
          james,
          sanni,
          nat,
          matt,
        ],
      },
      edis
    );

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

    /* TODO: for some reason this doesnt work????
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
    */

    const classGroup = await generateTestClass(
      {
        name: "Bruh",
        type: ClassType.Lecture,
        course: secr,
      },
      {
        users: [heinz],
      }
    );

    const classGroup2 = await generateTestClass(
      {
        name: "Bruh2",
        type: ClassType.Lecture,
        course: secr,
      },
      {
        users: [heinz],
      }
    );

    const timetable = await generateTestTimetable({
      duration: 60,
      name: secr.name,
      times: [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
      classGroup: classGroup,
    });

    const timetable2 = await generateTestTimetable({
      duration: 120,
      name: secr.name,
      times: [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
      classGroup: classGroup2,
    });
  }
}

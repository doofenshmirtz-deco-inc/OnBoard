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
  StudyGroup,
} from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { CourseRole, CourseGroupPair } from "../../models/CourseGroupPair";
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
    const an = await Announcement.create({
      title: context.course.code + " Announcement " + i,
      author: context.author,
      html: text,
      createdAt: Faker.date.past(1, new Date(Date.now())),
    }).save();

    an.course = context.course;
    an.author = context.author;
    an.save();
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
      avatar:
        "https://vignette.wikia.nocookie.net/phineasandferb/images/6/66/Profile_-_Perry_the_Platypus.PNG",
    }).create();

    const tom = await factory(User)({
      uid: "tom",
      name: "Tom Cranitch",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/H7U7woAF0/119029097_658777401415540_3584320142183412369_n.jpg",
    }).create();

    const kenton = await factory(User)({
      uid: "kenton",
      name: "Kenton Lam",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/79e3gZVAH/118886179_707789733143369_8050551153264937934_n.jpg",
    }).create();

    const matt = await factory(User)({
      uid: "matt",
      name: "Matthew Low",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/R3o_SUCpR/119667941_4387400197967648_3416189252965666527_n.png",
    }).create();

    const james = await factory(User)({
      uid: "james",
      name: "James Dearlove",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/Qu8f6UngR/119047745_671172086826576_8205359725655325991_n.jpg",
    }).create();

    const sanni = await factory(User)({
      uid: "sanni",
      name: "Sanni Bosamia",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/xXuKCfIOZ/118786576_951468675334793_3873917074362174615_n.png",
    }).create();

    const nat = await factory(User)({
      uid: "nat",
      name: "Natalie Hong",
      avatar:
        "https://onboard.doofenshmirtz.xyz/api/uploads/KfgvYDRuo/118785481_4424886224250722_505129378704425508_n.png",
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
      name: "Evil Design Inventing Studio 3 - Build",
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

    /*
    await generateTestAnnouncements(
      {
        course: evil,
        author: heinz,
      },
      [
        // "Doofenshmirtz Evil Incorparated!A place of evil and fighting! With Perry the Platypus too! Doofenshmirtz holding a Bucket!I don't know what it's for! Doofenshmirtz Ex-Wifes House in the Hills somewhere! Stop reminding me of her! Doofenshmirtz Wicked Witch Castle!",
        "Doofenshmirtz Evil Dirigible It's my awesome blimp! Doofenshmirtz Evil Incorparated! I don't wanna sing anymore! So we're through!",
      ]
    );
    */

    await factory(ClassGroup)({
      name: "Tutorial One",
      type: ClassType.Tutorial,
      course: secr,
      users: [heinz],
    }).create();

    await factory(ClassGroup)({
      name: "Lecture One",
      type: ClassType.Lecture,
      course: secr,
      users: [heinz],
      duration: 120,
    }).create();

    await factory(StudyGroup)({
      isPublic: true,
    }).createMany(20);

    await factory(StudyGroup)({
      users: [heinz, perry, tom, james, sanni, kenton, matt, nat],
      isPublic: false,
      name: "EDIS3801 Study Group",
    }).create();

    await factory(StudyGroup)({
      users: [heinz, perry, tom, james, sanni, kenton, matt, nat],
      isPublic: false,
      name: "Study sesh",
    }).create();
  }
}

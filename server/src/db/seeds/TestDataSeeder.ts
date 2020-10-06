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
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/119029097_658777401415540_3584320142183412369_n.jpg?_nc_cat=101&_nc_sid=ae9488&_nc_ohc=5rqNOkRkpBoAX838Taq&_nc_ht=scontent.fbne4-1.fna&oh=96f10045a0c2e8e3bf1e170d48b2c391&oe=5FA05CB8",
    }).create();

    const kenton = await factory(User)({
      uid: "kenton",
      name: "Kenton Lam",
      avatar:
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/p1080x2048/118886179_707789733143369_8050551153264937934_n.jpg?_nc_cat=102&_nc_sid=ae9488&_nc_ohc=YEX_CTpdfVcAX84GSqU&_nc_ht=scontent.fbne4-1.fna&tp=6&oh=72bbc2b592d259ce256fd746ff74e337&oe=5FA27BCB",
    }).create();

    const matt = await factory(User)({
      uid: "matt",
      name: "Matthew Low",
      avatar:
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/s2048x2048/119667941_4387400197967648_3416189252965666527_n.png?_nc_cat=106&_nc_sid=ae9488&_nc_ohc=Iitmj5pffXwAX94L-xW&_nc_ht=scontent.fbne4-1.fna&oh=b9d7eb06b55989cf861e39ff0eddc8f1&oe=5FA25663",
    }).create();

    const james = await factory(User)({
      uid: "james",
      name: "James Dearlove",
      avatar:
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/119047745_671172086826576_8205359725655325991_n.jpg?_nc_cat=104&_nc_sid=ae9488&_nc_ohc=NZaMv4Jyvt4AX9TbKfN&_nc_ht=scontent.fbne4-1.fna&oh=27de47131261f32a1a98581f9f207f9b&oe=5FA35C12",
    }).create();

    const sanni = await factory(User)({
      uid: "sanni",
      name: "Sanni Bosamia",
      avatar:
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/118786576_951468675334793_3873917074362174615_n.png?_nc_cat=109&_nc_sid=ae9488&_nc_ohc=O9qZTj5Y044AX_XBbzG&_nc_ht=scontent.fbne4-1.fna&oh=7eaa04e3a8b573a5883f3628bb230a6a&oe=5FA1EFEB",
    }).create();

    const nat = await factory(User)({
      uid: "nat",
      name: "Natalie Hong",
      avatar:
        "https://scontent.fbne4-1.fna.fbcdn.net/v/t1.15752-9/118785481_4424886224250722_505129378704425508_n.png?_nc_cat=105&_nc_sid=ae9488&_nc_ohc=gmWkfKq6qWYAX_n-GE3&_nc_ht=scontent.fbne4-1.fna&oh=0bca78cf50cf287455bf3165ee2ddaa4&oe=5FA2B05E",
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

    await factory(ClassGroup)({
      name: "Bruh",
      type: ClassType.Lecture,
      course: secr,
      users: [heinz],
    }).create();

    await factory(ClassGroup)({
      name: "Bruh2",
      type: ClassType.Lecture,
      course: secr,
      users: [heinz],
      duration: 120,
    }).create();
  }
}

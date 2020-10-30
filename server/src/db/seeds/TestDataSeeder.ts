/**
 * Seeds some non-random data for testing purposes. Users are team members
 * and some Doofenshmirtz characters as well.
 *
 * Creates some users, groups, courses, announcements, and study groups.
 */

import {
  Seeder,
  Factory,
  factory,
} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { Semesters, CourseLevel, Course } from "../../models/Course";
import {
  CourseGroup,
  ClassGroup,
  ClassType,
  StudyGroup,
  DMGroup,
} from "../../models/UserGroup";
import { CourseRole } from "../../models/CourseGroupPair";

// add the given course groups to the given course. the groups object maps
// roles to lists of users, which are attached to the course.
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

const generateDMs = async (users: User[]) => {
  const pairs = ([] as User[][]).concat(
    ...users.map((u1, i1) => users.slice(i1 + 1).map((u2) => [u1, u2]))
  );

  const groups = pairs.map(
    async (pair) => await factory(DMGroup)({ users: pair }).create()
  );
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

    const admin = await factory(User)({
      uid: "admin",
      name: "Admin",
      avatar:
        "https://probonoaustralia.com.au/wp-content/uploads/2019/09/UQ_Lockup-Stacked_Purple_RGB-WHITE.jpg",
    }).create();

    generateDMs([heinz, perry, tom, kenton, matt, james, sanni, nat]);

    const secr = await factory(Course)({
      code: "SECR1000",
      name: "Protecting Your Schemes from Secret Agents",
      semester: Semesters.One,
      level: CourseLevel.Undergrad,
      year: 2018,
    }).create();
    addGroups(
      { [CourseRole.Coordinator]: [heinz], [CourseRole.Student]: [perry] },
      secr
    );

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
        [CourseRole.Student]: [heinz, perry],
      },
      edis
    );

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

    await factory(ClassGroup)({
      name: "Lecture One",
      type: ClassType.Lecture,
      course: phfe,
      users: [heinz],
      duration: 120,
    }).create();

    await factory(StudyGroup)({
      isPublic: true,
    }).createMany(20);

    await factory(StudyGroup)({
      users: [tom, james, sanni, kenton, matt, nat],
      isPublic: false,
      name: "DECO3801 Study Group",
    }).create();

    await factory(StudyGroup)({
      users: [heinz, perry, tom, james, sanni, kenton, matt, nat],
      isPublic: false,
      name: "Study sesh",
    }).create();
  }
}

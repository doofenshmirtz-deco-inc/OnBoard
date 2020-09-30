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
  ClassGroup,
  ClassType,
} from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";
import { CourseRole } from "../../models/CourseGroupPair";
import Faker from "faker";
import { Timetable } from "../../models/Timetable";
import { Message } from "../../models/Message";

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
        avatar?: string;
      }
    | undefined
) => {
  if (!context) throw new Error("TestUserFactory requires context");

  return User.create({
    id: context.uid,
    name: context.name,
    email: context.email,
    avatar: context.avatar
      ? context.avatar
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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

  const group = await factory(CourseGroup)({
    users: userContext.users,
  }).create();

  if (userContext?.role) await course.addGroup(userContext?.role, group);

  // TODO maybe move to group seeder
  await factory(Message)({ group }).createMany(30);

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
    const heinz = await generateTestUser({
      uid: "doof-uid",
      name: "Heinz Doofenshmirtz",
      email: "heinz@evilinc.com",
      avatar:
        "https://vignette.wikia.nocookie.net/disney/images/4/41/DoofenshmirtzFull.jpg/revision/latest?cb=20190819173522",
    });

    const perry = await generateTestUser({
      uid: "perry-uid",
      name: "Perry The Platypus",
      email: "perry@evilinc.com",
      avatar:
        "https://upload.wikimedia.org/wikipedia/en/d/dc/Perry_the_Platypus.png",
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

    const classGroup = await generateTestClass(
      {
        name: "Bruh",
        type: ClassType.Lecture,
        course: math1071,
      },
      {
        users: [heinz],
      }
    );

    const classGroup2 = await generateTestClass(
      {
        name: "Bruh2",
        type: ClassType.Lecture,
        course: csse2310,
      },
      {
        users: [heinz],
      }
    );

    const timetable = await generateTestTimetable({
      duration: 60,
      name: math1071.name,
      times: [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
      classGroup: classGroup,
    });

    const timetable2 = await generateTestTimetable({
      duration: 120,
      name: csse2310.name,
      times: [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
      classGroup: classGroup2,
    });
  }
}

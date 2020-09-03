import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { Semesters, CourseLevel, Course, CourseRole } from "../../models/Course";
import { BaseGroup, GroupType } from "../../models/UserGroup";
import { Announcement } from "../../models/Announcement";

const generateEmptyGroup = (context?: {type: GroupType}) =>
  BaseGroup.create({ users: Promise.resolve([]), type: context?.type ?? GroupType.CourseStudents }).save();

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


const courseRoleToProperty = (role: CourseRole) => {
  switch (role) {
    case CourseRole.Coordinator:
      return 'coordinators';
    case CourseRole.Student:
      return 'students';
    case CourseRole.Tutor:
      return 'tutors';
  }
}

const generateTestCourse = async (
  context: { code: string; name: string; semester: Semesters; year: number },
  userContext?: { user: User; role: CourseRole }
) => {
  const userRole = userContext?.role ?? CourseRole.Coordinator;

  const course = Course.create({
    ...context,
    courseLevel: CourseLevel.Undergrad,
  });

  for (const role of Object.values(CourseRole)) {
    if (userContext && userRole === role) {
      const group = new BaseGroup();
      group.users = Promise.resolve([userContext.user]);
      course[courseRoleToProperty(role)] = await group.save();
    } else {
      course[courseRoleToProperty(role)] = await generateEmptyGroup();
    }
  }

  return course.save();
};

const generateTestAnnouncements = async (
  context: { course: Course; author: User },
  texts: string[]
) => {
  const author = Promise.resolve(context.author);

  const announcements = texts.map((a, i) => {
    return Announcement.create({
      title: context.course.code + " Announcement " + i,
      author: author,
      html: a,
    }).save();
  });

  context.course.announcements = Promise.all(announcements);
  return context.course.save();
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
        role: "students",
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
        role: "students",
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

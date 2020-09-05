import { User } from "../../models/User";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { UserGroup } from "../../models/UserGroup";
import { Timetable } from "../../models/Timetable";

/**
 * Generates a user for test (e.g. the user is enrolled in a course)
 */
export const generateTestingUser = async (
  context:
    | {
        uid: string;
        name: string;
        email: string;
        courseCode: string;
        courseSemester: Semesters;
        courseYear: number;
        courseEnrolment: "coordinator" | "tutor" | "student";
      }
    | undefined
) => {
  if (!context) throw new Error("TestUserFactory requires context");

  let user = await User.create({
    id: context.uid,
    name: context.name,
    email: context.email,
  }).save();

  /*
	let group = await UserGroup.create({
		users: Promise.resolve([user])
	}).save();
	*/
  let group = new UserGroup();
  group.users = Promise.resolve([user]);
  group = await group.save();

  await Course.create({
    code: context.courseCode,
    name: context.courseCode,
    year: context.courseYear,
    semester: Semesters.One,
    courseLevel: CourseLevel.Undergrad,
    coordinators:
      context.courseEnrolment == "coordinator"
        ? group
        : await UserGroup.create({ users: Promise.resolve([]) }).save(),
    tutors:
      context.courseEnrolment == "tutor"
        ? group
        : await UserGroup.create({ users: Promise.resolve([]) }).save(),
    students:
      context.courseEnrolment == "student"
        ? group
        : await UserGroup.create({ users: Promise.resolve([]) }).save(),
  }).save();
};
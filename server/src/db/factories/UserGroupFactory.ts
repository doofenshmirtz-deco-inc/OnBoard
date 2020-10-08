import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import {
  BaseGroup,
  GroupType,
  CourseGroup,
  ClassGroup,
  DMGroup,
  ClassType,
  StudyGroup,
} from "../../models/UserGroup";
import { User } from "../../models/User";
import { Course } from "../../models/Course";
import { CourseRole } from "../../models/CourseGroupPair";

type Users = {
  users: User[];
};

define(CourseGroup, async (faker, context?: Users) => {
  const group = new CourseGroup();
  group.setUsers(context?.users);
  return group;
});

define(DMGroup, async (faker, context?: Users) => {
  if (!context) throw new Error("Context must be defined");
  const group = DMGroup.create();
  group.users = Promise.resolve(context.users);
  return group;
});

define(ClassGroup, async (
  faker,
  ctx?: {
    course: Course;
    users: User[];
    name: string;
    type: ClassType;
    duration?: number;
    times?: Date[];
  }
) => {
  if (!ctx) throw new Error("Class seeder requires course");
  const classGroup = ClassGroup.create({
    name: ctx.name,
    type: ctx.type,
    course: ctx.course,
    times: ctx.times
      ? ctx.times
      : [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
    duration: ctx.duration ? ctx.duration : 60,
  }).save();

  (await classGroup).setUsers(ctx.users);

  return await classGroup;
});

define(StudyGroup, async (faker, ctx?: Users) => {
  const group = await StudyGroup.create({
    name: faker.lorem.words(3),
  }).save();

  if (ctx) group.setUsers(ctx.users);

  return group;
});

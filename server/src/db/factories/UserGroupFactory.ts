/**
 * Factory for a user group. User groups are used for a variety of purposes.
 * Defines various factories for the various group types. Check those for
 * specific context arguments.
 */

import { define } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import {
  CourseGroup,
  ClassGroup,
  DMGroup,
  ClassType,
  StudyGroup,
} from "../../models/UserGroup";
import { User } from "../../models/User";
import { Course } from "../../models/Course";

// User context.
type Users = {
  users: User[];
};

// Create a course group with the given users, or no users if not given.
define(CourseGroup, async (faker, context?: Users) => {
  const group = new CourseGroup();
  group.setUsers(context?.users);
  return group;
});

// Creates a dm group with the given users.
define(DMGroup, async (faker, context?: Users) => {
  if (!context) throw new Error("Context must be defined");
  const group = DMGroup.create();
  group.users = Promise.resolve(context.users);
  return group;
});

// Creates a class group with the given users. Requires context of appropriate
// properties.
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
  // Create new class group with context and defaults.
  // Times defaults to now and 24 hours from now.
  const classGroup = await ClassGroup.create({
    name: ctx.name,
    type: ctx.type,
    times: ctx.times
      ? ctx.times
      : [new Date(Date.now()), new Date(Date.now() + 1000 * 60 * 60 * 24)],
    duration: ctx.duration ? ctx.duration : 60,
  }).save();

  // Attach this class group to the given course and with the given users.
  classGroup.course = Promise.resolve(ctx.course);
  classGroup.setUsers(ctx.users);

  return await classGroup.save();
});

// Creates a study group with the given users, name, and visibility. Defaults
// used if not specified.
define(StudyGroup, async (
  faker,
  ctx?: {
    users?: User[];
    name?: string;
    isPublic?: boolean;
  }
) => {
  if (!ctx) ctx = {};
  const group = await StudyGroup.create({
    name: ctx.name || faker.lorem.words(3),
    isPublic: ctx.isPublic || faker.random.boolean(),
  }).save();

  if (ctx.users) group.setUsers(ctx.users);

  return group;
});

import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import {
  BaseGroup,
  GroupType,
  CourseGroup,
  ClassGroup,
} from "../../models/UserGroup";
import { User } from "../../models/User";
import { Timetable } from "../../models/Timetable";
import { Course } from "../../models/Course";
import { CourseRole } from "../../models/CourseGroupPair";

type Users = {
  users: User[];
};

define(CourseGroup, async (faker, context?: Users) => {
  console.log("course");
  const group = new CourseGroup();
  group.setUsers(context?.users);
  return group;
});

define(ClassGroup, async (faker, context?: Users) => {
  const group = new ClassGroup();
  group.setUsers(context?.users);
  group.name = faker.lorem.words(2) + " Class Group";

  return group;
});

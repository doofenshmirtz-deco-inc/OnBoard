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
import { Message } from "../../models/Message";

type Ctx = {
  group: BaseGroup;
};

define(Message, async (faker, ctx?: Ctx) => {
  if (!ctx) throw new Error("Requires context");
  if (!(await ctx.group.users).length) throw new Error("Group must have users");

  const message = new Message();
  message.group = ctx!.group;
  message.user = (await ctx.group.users)[
    faker.random.number({ min: 0, max: (await ctx.group.users).length - 1 })
  ];

  message.text = faker.lorem.sentences(faker.random.number({ min: 1, max: 5 }));
  return message;
});

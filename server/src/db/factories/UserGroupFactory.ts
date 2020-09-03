import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { BaseGroup, GroupType, CourseGroup } from "../../models/UserGroup";
import { User } from "../../models/User";
import { Timetable } from "../../models/Timetable";

define(BaseGroup, (
  faker: typeof Faker,
  context:
    | {
        num: number;
      }
    | undefined
) => {
  if (!context) throw new Error("Invalid Context");

  let userGroup = new BaseGroup();
  userGroup.users = factory(User)().createMany(10);

  return userGroup;
});

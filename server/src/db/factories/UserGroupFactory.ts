import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { BaseGroup, GroupType } from "../../models/UserGroup";
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
  userGroup.name = faker.lorem.words();
  userGroup.users = factory(User)().createMany(10);
  userGroup.timetable = factory(Timetable)().create();
  userGroup.type = faker.random.arrayElement(Object.values(GroupType));

  return userGroup;
});

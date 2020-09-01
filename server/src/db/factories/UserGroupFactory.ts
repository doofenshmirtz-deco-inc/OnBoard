import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { UserGroup } from "../../models/UserGroup";
import { User } from "../../models/User";
import { Timetable } from "../../models/Timetable";

define(UserGroup, (
  faker: typeof Faker,
  context:
    | {
        num: number;
      }
    | undefined
) => {
  if (!context) throw new Error("Invalid Context");

  let userGroup = new UserGroup();
  userGroup.name = faker.lorem.words();
  userGroup.users = factory(User)().createMany(10);
  userGroup.timetables = factory(Timetable)().createMany(10);

  return userGroup;
});

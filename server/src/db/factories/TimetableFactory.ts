import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { User } from "../../models/User";
import { Timetable } from "../../models/Timetable";

define(Timetable, (faker) => {
  const timetable = new Timetable();

  timetable.name = faker.lorem.words();
  timetable.duration = faker.random.number(200);
  timetable.times = new Array(faker.random.number(10))
    .fill(null)
    .map(() => faker.date.recent(7));

  return timetable;
});

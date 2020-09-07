import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { Course } from "../../models/Course";
import { CourseRole } from "../../models/CourseGroupPair";
import { User } from "../../models/User";
import { CourseGroup } from "../../models/UserGroup";

export default class CourseSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = Promise.all(
      (await factory(User)().createMany(3)).map(u => u.save())
    );

    const coordinators = await factory(CourseGroup)({
      users
    }).create();
    coordinators.save();

    const courses = await factory(Course)({
      groups: {
        [CourseRole.Coordinator]: coordinators,
      },
    }).createMany(10);
  }
}

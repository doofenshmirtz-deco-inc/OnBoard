import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";

export default class CourseSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    /*
    const coordinators = await factory(CourseGroup)({
      users,
    }).create();
    coordinators.save();
	*/

    /* TODO
    const courses = await factory(Course)({
      groups: {
        [CourseRole.Coordinator]: coordinators,
      },
    }).createMany(10);
	*/
  }
}

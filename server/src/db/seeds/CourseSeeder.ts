import {Seeder, Factory} from "@doofenshmirtz-deco-inc/typeorm-seeding";
import {Connection} from "typeorm";
import {Course} from "../../models/Course";

export default class CourseSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Course)().createMany(1); // TODO done
	console.log((await Course.find()).map(course => course.coordinators));
  }
}

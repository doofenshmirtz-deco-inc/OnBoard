import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";

export default class CourseSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // create three (3) users.
    const users = Promise.all(
      (await factory(User)().createMany(3)).map((u) => u.save())
    );
  }
}

import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { generateTestingUser } from "../factories/TestingUserFactory";
import { Semesters } from "../../models/Course";

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // This probably isnt need anymore due to the course seeder
    // await factory(User)().createMany(10);
  }
}

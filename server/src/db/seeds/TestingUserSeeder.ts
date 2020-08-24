import { Seeder, Factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../models/User";
import { generateTestingUser } from "../factories/TestingUserFactory";
import { Semesters } from "../../models/Course";

export default class TestingUserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await generateTestingUser({
      uid: "doof-uid",
      name: "Heinz Doofenshmirtz",
      email: "heinz@evilinc.com",
      courseID: "MATH1071",
      courseSemester: Semesters.One,
      courseYear: 2018,
      courseEnrolment: "student",
    });

    await generateTestingUser({
      uid: "bad-uid",
      name: "Bad User",
      email: "bad@bad.bad",
      courseID: "Bad Course",
      courseSemester: Semesters.One,
      courseYear: 2018,
      courseEnrolment: "student",
    });
  }
}

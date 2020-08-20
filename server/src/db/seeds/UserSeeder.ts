import {Seeder, Factory} from "typeorm-seeding";
import {Connection} from "typeorm";
import {User} from "../../models/User";

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
	await User.create({
		id: 'doof-uid',
		name: 'Heinz Doofenshmirtz',
		email: 'heinz@evilinc.com'
	}).save();

    await factory(User)().createMany(10);
  }
}

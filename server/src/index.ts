import { createConnection } from "typeorm";
import { User } from "./models/User";

async function main() {
	const connection = await createConnection();

	console.log(await User.create({
		id: 123,
		name: 'User',
		email: 'aaa@bbb.ccc'
	}).save());

	console.log(await User.find());
}

main();

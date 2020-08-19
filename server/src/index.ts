import { createConnection } from "typeorm";
import { User } from "./models/User";
import {UserResolver} from "./resolvers/UserResolver";
import {buildSchema} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import admin from "firebase-admin";
import {AuthResolver} from "./resolvers/AuthResolver";

async function main() {
	const port = 5000;
	const connection = await createConnection();

	for (let i = 0; i++; i < 20) {
		// Sample db insert command
		console.log(await User.create({
			id: 123,
			name: 'User',
			email: 'aaa@bbb.ccc'
		}).save());
	}

	const serviceAccount = require("../firebase-admin.json");

	admin.initializeApp({
  		credential: admin.credential.cert(serviceAccount),
	});


	const schema = await buildSchema({
		resolvers: [UserResolver, AuthResolver]
	});

	const app = express();
	const server = new ApolloServer({ schema });
	server.applyMiddleware({ app });
	app.listen(port, () => {
		console.log("Server running on 5000...");
	});

}

main();

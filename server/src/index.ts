import { createConnection } from "typeorm";
import { User } from "./models/User";
import {UserResolver} from "./resolvers/UserResolver";
import {buildSchema} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import admin from "firebase-admin";
import {AuthResolver} from "./resolvers/AuthResolver";
import firebase from "firebase/app";

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

	firebase.initializeApp({
      apiKey: "AIzaSyAwD46JJ62Y_Jn-2JFV3j6-la7djOZLa1c",
      authDomain: "onboard-8f0f9.firebaseapp.com",
      databaseURL: "https://onboard-8f0f9.firebaseio.com",
      projectId: "onboard-8f0f9",
      storageBucket: "onboard-8f0f9.appspot.com",
      messagingSenderId: "1083512866922",
      appId: "1:1083512866922:web:072fd28e9ec92c04c22213"
	})


	const schema = await buildSchema({
		resolvers: [UserResolver, AuthResolver]
	});

	const app = express();
	const server = new ApolloServer({ 
		schema,
		context: ({ req, res }) => ({ req, res })
	});

	server.applyMiddleware({ app });
	app.listen(port, () => {
		console.log("Server running on 5000...");
	});

}

main();

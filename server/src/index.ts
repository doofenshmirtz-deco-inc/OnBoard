import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/UserResolver";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import admin from "firebase-admin";
import { AuthResolver } from "./resolvers/AuthResolver";
import firebase from "firebase/app";
import { CourseResolver } from "./resolvers/CourseResolver";
import { UserGroupResolver } from "./resolvers/UserGroupResolver";
import { MessageResolver } from "./resolvers/MessageResolver";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { AppPubSub } from "./resolvers/AppPubSub";

async function main() {
  const port = 5000;
  const connection = await createConnection();
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
    appId: "1:1083512866922:web:072fd28e9ec92c04c22213",
  });

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      CourseResolver,
      UserGroupResolver,
      MessageResolver,
    ],
    emitSchemaFile: true,
    pubSub: AppPubSub,
  });

  const app = express();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res, connection }) => ({ req, res, connection }),
  });

  apolloServer.applyMiddleware({ app });
  const server = createServer(app);
  apolloServer.installSubscriptionHandlers(server);

  server.listen(port, () => {
    console.log(`Server running on ${port}...`);
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`
    );
  });
}

main();

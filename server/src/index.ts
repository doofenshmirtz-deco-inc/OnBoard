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
import { AnnouncementResolver } from "./resolvers/AnnouncementResolver";
import { createServer } from "http";
import { AppPubSub } from "./resolvers/AppPubSub";
import {
  FolderNodeResolver,
  NodeResolver,
} from "./resolvers/CoursePageResolver";
import {
  UploadResolver,
  UPLOAD_URL_ROOT,
  UPLOAD_PATH_ROOT,
} from "./resolvers/UploadResolver";
import { graphqlUploadExpress, GraphQLUpload } from "graphql-upload";
import path from "path";
import { authChecker } from "./middleware/authChecker";

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
    scalarsMap: [
      // @ts-ignore
      { type: () => GraphQLUpload, scalar: GraphQLUpload },
    ],
    resolvers: [
      UserResolver,
      AuthResolver,
      CourseResolver,
      UserGroupResolver,
      MessageResolver,
      FolderNodeResolver,
      UploadResolver,
      FolderNodeResolver,
      NodeResolver,
      AnnouncementResolver,
    ],
    emitSchemaFile: true,
    pubSub: AppPubSub,
    authChecker: authChecker,
  });

  const app = express();
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res, connection, payload }: any) => {
      // console.log(req);
      // console.log(res);
      // console.log(connection);
      // console.log(payload?.auth);
      return { req, res, connection, auth: payload?.auth };
    },
    subscriptions: {
      onConnect: (params, ws, context) => {
        // console.log('auth', (params as any).auth);
        return {
          ...context,
          auth: (params as any).auth,
        };
      },
    },
    uploads: false,
  });

  app.use(UPLOAD_URL_ROOT, express.static(UPLOAD_PATH_ROOT));

  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app });

  if (process.env.NODE_ENV !== "development") {
    app.use(express.static("../client/build"));
    app.use("*", express.static("../client/build"));
  }

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

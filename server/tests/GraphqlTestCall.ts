// Borrowed from https://github.com/benawad/graphql-typescript-stripe-example/blob/testing-resolvers/server/src/graphqlTestCall.ts

import { graphql } from "graphql";
import {UserResolver} from "../src/resolvers/UserResolver";
import {AuthResolver} from "../src/resolvers/AuthResolver";
import {buildSchema} from "type-graphql";


export const graphqlTestCall = async (
  query: any,
  variables?: any,
  userId?: number | string
) => {
	const schema = await buildSchema({
		resolvers: [UserResolver, AuthResolver]
	});

  return graphql(
    schema,
    query,
    variables,
    {
      req: {
        session: {
          userId
        }
      },
      res: {
        clearCookie: jest.fn()
      }
    },
  );
};

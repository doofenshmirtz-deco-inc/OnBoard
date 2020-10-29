/**
 * Model to represent a test auth token (only used in development)
 */

import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AuthToken {
  @Field()
  token: string;
}

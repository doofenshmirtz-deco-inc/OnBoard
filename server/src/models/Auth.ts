import { ObjectType, Field } from "type-graphql";

// TODO this may need to be modified to fit the front end
@ObjectType()
export class AuthToken {
  @Field()
  token: string;
}

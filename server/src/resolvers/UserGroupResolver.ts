import {
  Resolver,
  Query,
  Args,
  Arg,
  ID,
  Int,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import { User } from "../models/User";
import { PaginationArgs, getOrder } from "./Types";
import { isAuth } from "../middleware/isAuth";
import { Context } from "../middleware/Context";
import { UserGroup } from "../models/UserGroup";

@Resolver((of) => UserGroup)
export class UserGroupResolver {
  @Query(() => [UserGroup])
  @UseMiddleware(isAuth)
  async userGroups(@Args() pag: PaginationArgs) {
    return (
      await UserGroup.findAndCount({
        order: getOrder(pag),
        take: pag.limit,
        skip: pag.skip,
      })
    )[0];
  }

  @Query(() => UserGroup, { nullable: true })
  @UseMiddleware(isAuth)
  async userGroup(@Arg("id", () => String) id: String) {
    return UserGroup.findOne({
      where: { id },
    });
  }

  @FieldResolver((type) => [User])
  @UseMiddleware(isAuth)
  async users(@Root() group: UserGroup, @Ctx() ctx: Context) {
    /* TODO need to decide how to handle permissions
    const user = await User.findOne({ where: { id: ctx.payload?.uid } });
    if (!user) throw new Error("User is invalid");
	  if (!users.map(user => user.id).includes(user.id)) throw new Error("Invali persmissions to view group members");
	  */

    const users = await group.users;
    return users;
  }
}

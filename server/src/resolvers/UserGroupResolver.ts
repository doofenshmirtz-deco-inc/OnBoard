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
import { BaseGroup } from "../models/UserGroup";
import { Timetable } from "../models/Timetable";

@Resolver((of) => BaseGroup)
export class UserGroupResolver {
  @Query(() => [BaseGroup])
  @UseMiddleware(isAuth)
  async userGroups(@Args() pag: PaginationArgs) {
    return (
      await BaseGroup.findAndCount({
        order: getOrder(pag),
        take: pag.limit,
        skip: pag.skip,
      })
    )[0];
  }

  @Query(() => BaseGroup, { nullable: true })
  @UseMiddleware(isAuth)
  async userGroup(@Arg("id", () => String) id: String) {
    return BaseGroup.findOne({
      where: { id },
    });
  }

  @FieldResolver((type) => [User])
  @UseMiddleware(isAuth)
  async users(@Root() group: BaseGroup, @Ctx() ctx: Context) {
    /* TODO need to decide how to handle permissions
    const user = await User.findOne({ where: { id: ctx.payload?.uid } });
    if (!user) throw new Error("User is invalid");
	  if (!users.map(user => user.id).includes(user.id)) throw new Error("Invali persmissions to view group members");
	  */

    const users = await group.users;
    return users;
  }
}

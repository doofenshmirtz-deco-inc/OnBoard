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

@Resolver((of) => User)
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async users(@Args() pag: PaginationArgs) {
    return (
      await User.findAndCount({
        order: getOrder(pag),
        take: pag.limit,
        skip: pag.skip,
      })
    )[0];
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => String) id: String): Promise<User | undefined> {
    return User.findOne({
      where: { id },
    });
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: Context) {
	  // TODO sort groups by most recent message
    return User.findOne({
      where: { id: ctx.payload?.uid },
    });
  }

  @FieldResolver((type) => [UserGroup])
  async groups(@Root() user: User) {
    return await user.groups;
  }
}

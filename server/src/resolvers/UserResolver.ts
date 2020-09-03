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
import { BaseGroup, GroupType } from "../models/UserGroup";
import { Course, CourseRole } from "../models/Course";

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
    return User.findOne({
      where: { id: ctx.payload?.uid },
    });
  }

  @FieldResolver((type) => [BaseGroup])
  async groups(@Root() user: User, @Arg("type", () => GroupType, {nullable: true}) type: GroupType | null) {
    return (await user.groups).filter(x => type == null || x.type == type);
  }

  // @FieldResolver(() => [Course])
  // async courses(@Root() user: User, @Arg("role", () => CourseRole, {nullable: true}) role: CourseRole | null) {
  //   //return (await user.groups).filter(x => x.)
    
  // }
}

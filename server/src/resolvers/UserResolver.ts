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
import { BaseGroup, GroupType, CourseGroup, Group } from "../models/UserGroup";
import { Course, CourseColor, CourseColours } from "../models/Course";
import { CourseRole, CourseGroupPair } from "../models/CourseGroupPair";

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

  @FieldResolver((type) => [Group])
  async groups(
    @Root() user: User,
    @Arg("role", () => CourseRole, { nullable: true }) role: CourseRole | null
  ) {
    return (await user.groups)
      .filter((x) => x.groupType == GroupType.Course)
      .sort((x, y) => y.lastActive.getTime() - x.lastActive.getTime());
  }

  @FieldResolver(() => [CourseColor])
  async courses(
    @Root() user: User,
    @Arg("role", () => CourseRole, { nullable: true }) role: CourseRole | null
  ): Promise<CourseColor[]> {
    let query = CourseGroupPair.createQueryBuilder("cgp")
      .leftJoinAndSelect("cgp.group", "group")
      .leftJoinAndSelect("cgp.course", "course")
      .leftJoinAndSelect("group.users", "user")
      .where("user.id = :uid", { uid: user.id });
    if (role) query = query.where("cgp.role = :role", { role });
    return (await query.getMany()).map((p, i) => {
      return {
        course: p.course,
        colour: CourseColours[i % 4],
      };
    });
  }
}

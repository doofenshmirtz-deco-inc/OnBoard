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
  Authorized,
  Mutation,
} from "type-graphql";
import { User } from "../models/User";
import { PaginationArgs, getOrder } from "./Types";
import { Context } from "../middleware/Context";
import {
  BaseGroup,
  ClassGroup,
  GroupType,
  CourseGroup,
  DMGroup,
  StudyGroup,
} from "../models/UserGroup";
import { CourseGroupPair } from "../models/CourseGroupPair";

@Resolver((of) => BaseGroup)
export class UserGroupResolver {
  @Query(() => [BaseGroup])
  @Authorized()
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
  @Authorized()
  async userGroup(@Arg("id", () => String) id: String) {
    return BaseGroup.findOne({
      where: { id },
    });
  }

  @FieldResolver((type) => [User])
  async users(@Root() group: BaseGroup, @Ctx() ctx: Context) {
    /* TODO need to decide how to handle permissions
    const user = await User.findOne({ where: { id: ctx.payload?.uid } });
    if (!user) throw new Error("User is invalid");
	  if (!users.map(user => user.id).includes(user.id)) throw new Error("Invali persmissions to view group members");
	*/

    const users = await group.users;
    return users;
  }

  @FieldResolver(() => String)
  async name(@Root() group: BaseGroup, @Ctx() ctx: Context) {
    if (!ctx.payload) throw new Error("User must be authenticated");
    if (group instanceof DMGroup)
      return (await group.users).filter((u) => u.id !== ctx.payload?.uid)[0]
        .name;
    if (group instanceof CourseGroup) {
      let query = CourseGroupPair.createQueryBuilder("cgp")
        .leftJoinAndSelect("cgp.group", "group")
        .leftJoinAndSelect("cgp.course", "course")
        .where("group.id = :id", { id: group.id });
      const cgp = await query.getOne();
      return `${cgp?.course.code}: ${cgp?.course.name}`;
    }
  }

  @Mutation(() => StudyGroup)
  @Authorized()
  async addStudyGroup(
    @Arg("groupName") name: string,
    @Arg("isPublic") isPublic: boolean,
    @Arg("uids", () => [String]) uids: string[],
    @Ctx() ctx: Context
  ) {
    if (!ctx.payload) throw new Error("Invalid user");
    uids.push(ctx.payload.uid);
    const users = await User.findByIds(uids);

    const group = StudyGroup.create({
      name,
      isPublic,
    });

    await group.setUsers(users);
    return await group.save();
  }
}

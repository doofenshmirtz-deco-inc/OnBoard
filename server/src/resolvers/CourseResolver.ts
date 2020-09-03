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
import { Course, CoursePK } from "../models/Course";
import { BaseGroup } from "../models/UserGroup";

@Resolver((of) => Course)
export class CourseResolver {
  @Query(() => BaseGroup)
  @UseMiddleware(isAuth)
  async courseStudents(
    @Args() pag: PaginationArgs,
    @Args() coursePK: CoursePK,
    @Ctx() ctx: Context
  ) {
    // TODO maybe paginate

    const user = await User.findOne({ where: { id: ctx.payload?.uid } });
    if (!user) throw new Error("User is invalid");

    const course = await Course.findOne({ where: { ...coursePK } });
    if (
      !(await course?.coordinators.users)
        ?.map((user) => user.id)
        .includes(user.id) &&
      !(await course?.tutors.users)?.map((user) => user.id).includes(user.id)
    )
      throw new Error("Unauthorised access");

    return course?.students;
  }

  @Query(() => BaseGroup)
  @UseMiddleware(isAuth)
  async courseCoordinators(@Args() coursePK: CoursePK) {
    const course = await Course.findOne({ where: { ...coursePK } });
    return course?.coordinators;
  }

  @Query(() => BaseGroup)
  @UseMiddleware(isAuth)
  async courseTutors(@Args() coursePK: CoursePK) {
    const course = await Course.findOne({ where: { ...coursePK } });
    return course?.tutors;
  }

  @Query(() => [Course])
  @UseMiddleware(isAuth)
  async courses(@Args() pag: PaginationArgs) {
    return (
      await Course.findAndCount({
        order: getOrder(pag),
        take: pag.limit,
        skip: pag.skip,
      })
    )[0];
  }
}

import {
  Resolver,
  Query,
  Args,
  Arg,
  ID,
  UseMiddleware,
  Authorized,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import { PaginationArgs, getOrder } from "./Types";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { CourseGroupPair } from "../models/CourseGroupPair";

@Resolver((of) => Course)
export class CourseResolver {
  @Query(() => [Course])
  @Authorized()
  async courses(@Args() pag: PaginationArgs) {
    return (
      await Course.findAndCount({
        order: getOrder(pag),
        take: pag.limit,
        skip: pag.skip,
      })
    )[0];
  }

  @Query(() => Course)
  @Authorized()
  async course(@Arg("courseID", () => ID) courseID: number) {
    return await Course.findOne({ id: courseID });
  }

  @FieldResolver(() => [User])
  async staff(@Root() course: Course) {
    return [];
    console.log("here");

    let query = User.createQueryBuilder("user")
      .leftJoinAndSelect("user.group", "group")
      .leftJoinAndSelect("group.coursePair", "cgp")
      .leftJoinAndSelect("cgp.course", "course")
      .where("course.id = :id", { id: course.id });

    console.log(await query.getMany());
  }
}

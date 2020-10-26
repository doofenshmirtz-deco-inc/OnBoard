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
    let query = User.createQueryBuilder("user")
      .leftJoin("user.groups", "group")
      .leftJoin("group.coursePair", "cgp")
      .leftJoin("cgp.course", "course")
      .where(
        "(cgp.role = 'Coordinators' OR cgp.role = 'Tutors') AND course.id = :id",
        {
          id: course.id,
        }
      );

    return await query.getMany();
  }
}

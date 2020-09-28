import { Resolver, Query, Args, Arg, ID, UseMiddleware } from "type-graphql";
import { PaginationArgs, getOrder } from "./Types";
import { isAuth } from "../middleware/isAuth";
import { Course } from "../models/Course";

@Resolver((of) => Course)
export class CourseResolver {
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

  @Query(() => Course)
  @UseMiddleware(isAuth)
  async course(@Arg("courseID", () => ID) courseID: number) {
    return await Course.findOne({ id: courseID });
  }
}

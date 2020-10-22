import {
  Resolver,
  Query,
  Args,
  Arg,
  ID,
  UseMiddleware,
  Authorized,
  Ctx,
} from "type-graphql";
import { PaginationArgs, getOrder } from "./Types";
import { Course } from "../models/Course";

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
}

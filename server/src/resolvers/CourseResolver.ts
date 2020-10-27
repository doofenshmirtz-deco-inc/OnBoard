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
  Mutation,
} from "type-graphql";
import { PaginationArgs, getOrder } from "./Types";
import { Course, courseInput } from "../models/Course";
import { User } from "../models/User";
import { CourseGroupPair, CourseRole } from "../models/CourseGroupPair";
import { factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { CourseGroup } from "../models/UserGroup";

const addGroups = async (
  groups: {
    [role in CourseRole]?: User[];
  },
  course: Course
) => {
  if (groups) {
    for (const [role, users] of Object.entries(groups)) {
      const group = new CourseGroup();
      await group.save();
      await group.setUsers(users);
      await group.save();
      await course.addGroup(role as CourseRole, group);
    }
  }
};

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

  @Mutation(() => Course)
  async addCourse(@Arg("course") course: courseInput): Promise<Course> {
    const c = await Course.create(course).save();

    addGroups(
      {
        [CourseRole.Student]: await User.findByIds(course.students),
      },
      c
    );

    return await c.save();
  }
}

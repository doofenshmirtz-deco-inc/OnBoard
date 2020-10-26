import {
  Resolver,
  Query,
  Args,
  Arg,
  ID,
  UseMiddleware,
  Authorized,
  Ctx,
  Mutation,
} from "type-graphql";
import { Announcement, AnnouncementInput } from "../models/Announcement";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { Context } from "../middleware/Context";

@Resolver(() => Announcement)
export class AnnouncementResolver {
  @Mutation(() => Announcement)
  @Authorized()
  async createAnnouncement(
    @Arg("annoucementInput") data: AnnouncementInput,
    @Ctx() ctx: Context
  ) {
    const user = User.findOne({ id: ctx.payload.uid });
    const course = Course.findOne({ id: data.courseID });

    if (!user || !course) throw new Error("User or course are invalid");

    return await Announcement.create({
      title: data.title,
      html: data.html,
    }).save();
  }

  @Mutation(() => Announcement)
  @Authorized()
  async createAnnouncement(@Arg("id", () => ID) id: number) {
    return await Announcement.delete({ id });
  }
}

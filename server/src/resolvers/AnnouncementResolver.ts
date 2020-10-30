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
  async addAnnouncement(
    @Arg("data") data: AnnouncementInput,
    @Ctx() ctx: Context
  ) {
    if (!ctx.payload) throw new Error("Invalid payload");
    const user = await User.findOne({ id: ctx.payload.uid });
    const course = await Course.findOne({ id: data.courseID });
    if (!user || !course) throw new Error("User or course are invalid");

    return await Announcement.create({
      title: data.title,
      html: data.html,
      author: user,
      course,
    }).save();
  }

  @Mutation(() => Announcement)
  @Authorized()
  async deleteAnnouncement(@Arg("id", () => ID) id: number) {
    const an = await Announcement.findOne({ id });
    await Announcement.delete({ id });
    return an;
  }
}

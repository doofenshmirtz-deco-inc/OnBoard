import {
  Resolver,
  Query,
  Args,
  UseMiddleware,
  Mutation,
  Arg,
  Ctx,
  Subscription,
  Root,
  ArgsType,
  ID,
  Authorized,
} from "type-graphql";
import { User } from "../models/User";
import { Context } from "../middleware/Context";
import { Message, MessageInput } from "../models/Message";
import { BaseGroup } from "../models/UserGroup";
import { Subscriptions } from "./Subscriptions";

@Resolver((of) => Message)
export class MessageResolver {
  @Mutation((type) => Message)
  @Authorized()
  async addMessage(@Arg("message") message: MessageInput, @Ctx() ctx: Context) {
    let group = await BaseGroup.findOne({ id: message.groupID });

    if (!ctx.payload) throw new Error("Invalid user");
    if (!group) throw new Error("Invalid group");
    if (!(await group.users).map((user) => user.id).includes(ctx.payload?.uid))
      throw new Error("User not in group");

    let user = await User.findOne({
      id: ctx.payload.uid,
    });

    return await Message.create({
      user,
      group,
      ...message,
    }).save();
  }

  @Query((type) => [Message])
  @Authorized()
  async getMessages(
    @Arg("groupID", () => ID) groupID: number,
    @Ctx() ctx: Context
  ): Promise<Message[]> {
    let group = await BaseGroup.findOne({ id: groupID });
    if (!ctx.payload) throw new Error("Invalid user");
    if (!group) throw new Error("Invalid group");
    if (!(await group.users).map((user) => user.id).includes(ctx.payload?.uid))
      throw new Error("User not in group");

    let user = await User.findOne({
      id: ctx.payload.uid,
    });

    // TODO pagnation
    return await Message.find({ group });
  }

  @Subscription((type) => Message, {
    topics: Subscriptions.Messages,
    filter: async ({ payload, args }) => {
      const user = (await User.findByIds([args.uid]))[0];
      return (
        (await user.groups).filter((g) => (g.id = payload.group.id)).length > 0
      );
    },
  })
  @Authorized()
  async newMessages(
    @Root() message: Message,
    @Arg("uid", () => ID) uid: number
  ): Promise<Message> {
    // TOOD make this actually for group
    // TODO auth: https://www.apollographql.com/docs/graphql-subscriptions/authentication/
    return message;
  }
}

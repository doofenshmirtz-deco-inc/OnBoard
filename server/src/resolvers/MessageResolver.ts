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
} from "type-graphql";
import { User } from "../models/User";
import { isAuth } from "../middleware/isAuth";
import { Context } from "../middleware/Context";
import { Message, MessageInput } from "../models/Message";
import { BaseGroup } from "../models/UserGroup";
import { Subscriptions } from "./Subscriptions";
import { isAuthSub } from "../middleware/isAuthSub";

@Resolver((of) => Message)
export class MessageResolver {
  @Mutation((type) => Message)
  @UseMiddleware(isAuth)
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
  @UseMiddleware(isAuth)
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
    filter: ({ payload, args }) => payload.group.id == args.groupID,
  })
  // @UseMiddleware(isAuthSub)
  async newMessages(
    @Root() message: Message,
    @Arg("groupID", () => ID) groupID: number
  ): Promise<Message> {
    // TOOD make this actually for group
    // TODO auth: https://www.apollographql.com/docs/graphql-subscriptions/authentication/
    return message;
  }
}

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
} from "type-graphql";
import { User } from "../models/User";
import { isAuth } from "../middleware/isAuth";
import { Context } from "../middleware/Context";
import { Message, MessageInput } from "../models/Message";
import { UserGroup } from "../models/UserGroup";
import { Subscriptions } from "./Subscriptions";
import { isAuthSub } from "../middleware/isAuthSub";

@Resolver((of) => Message)
export class MessageResolver {
  @Mutation((type) => Message)
  @UseMiddleware(isAuth)
  async addMessage(@Arg("message") message: MessageInput, @Ctx() ctx: Context) {
    let group = await UserGroup.findOne({ id: message.groupID });

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
    @Arg("groupID") groupID: number,
    @Ctx() ctx: Context
  ): Promise<Message[]> {
    let group = await UserGroup.findOne({ id: groupID });
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
  @UseMiddleware(isAuthSub)
  async newMessages(
    @Root() message: Message,
    @Arg("groupID") groupID: number
  ): Promise<Message> {
    // TODO auth: https://www.apollographql.com/docs/graphql-subscriptions/authentication/
    return message;
  }
}
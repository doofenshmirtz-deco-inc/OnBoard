import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  AfterInsert,
} from "typeorm";
import {
  ObjectType,
  ID,
  Field,
  Int,
  InputType,
  PubSub,
  PubSubEngine,
  Subscription,
  Publisher,
} from "type-graphql";
import { User } from "./User";
import { BaseGroup } from "./UserGroup";
import { Subscriptions } from "../resolvers/Subscriptions";
import { AppPubSub } from "../resolvers/AppPubSub";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne((type) => BaseGroup, { eager: true })
  @Field()
  group: BaseGroup;

  @ManyToOne((type) => User, { eager: true })
  @Field()
  user: User;

  @Column()
  @Field()
  text: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @AfterInsert()
  async newMessage() {
    await AppPubSub.publish(Subscriptions.Messages, this);
  }
}

@InputType()
export class MessageInput extends BaseEntity {
  @Field(() => Int)
  groupID: number;

  @Field()
  text: string;
}

/**
 * Model to represent an announcement
 */

import {
  Column,
  PrimaryColumn,
  BaseEntity,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, ID, Field, Int, InputType } from "type-graphql";
import { User } from "./User";
import { Course } from "./Course";

/**
 * This is a timetable containing dates and times. It can be attached to one or more groups.
 */
@Entity()
@ObjectType()
export class Announcement extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Course, (c) => c.announcements)
  @Field(() => Course)
  course: Course;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  @Field(() => User)
  author: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  html: string;
}

@InputType()
export class AnnouncementInput {
  @Field(() => ID)
  courseID: number;

  @Field()
  title: string;

  @Field()
  html: string;
}

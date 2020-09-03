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
import { ObjectType, ID, Field, Int } from "type-graphql";
import { User } from "./User";
import { UserGroup } from "./UserGroup";
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
  course: Promise<Course>;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  author: Promise<User>;

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
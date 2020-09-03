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
} from "typeorm";
import { ObjectType, ID, Field, Int } from "type-graphql";
import { User } from "./User";
import { BaseGroup } from "./UserGroup";

/**
 * This is a timetable containing dates and times. It can be attached to one or more groups.
 */
@Entity()
@ObjectType()
export class Timetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column("timestamp", { array: true })
  @Field(() => [Date])
  times: Date[];

  @Column()
  @Field()
  duration: number;

  @OneToMany(() => BaseGroup, (group) => group.timetable)
  groups: Promise<BaseGroup[]>;
}

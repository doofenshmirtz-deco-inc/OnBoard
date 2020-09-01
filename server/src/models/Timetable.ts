import {
    Column,
    PrimaryColumn,
    BaseEntity,
    Entity,
    OneToMany,
    ManyToMany,
    JoinTable,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { ObjectType, ID, Field, Int } from "type-graphql";
  import { User } from "./User";
import { UserGroup } from "./UserGroup";
  
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
  name: string;

  @Column("timestamp", {array: true})
  times: Date[];

  @Column()
  duration: number;

  @ManyToMany(() => UserGroup, group => group.timetables)
  groups: Promise<UserGroup[]>
}
  
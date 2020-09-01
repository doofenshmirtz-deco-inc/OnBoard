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
import { Timetable } from "./Timetable";

@Entity()
@ObjectType()
export class UserGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field()
  name?: string;

  @ManyToMany(() => User, (user) => user.groups, { cascade: true })
  @JoinTable()
  users: Promise<User[]>;

  @ManyToOne(() => Timetable, (t) => t.groups, { nullable: true })
  @Field(() => Timetable, { nullable: true })
  timetable?: Promise<Timetable>;
}

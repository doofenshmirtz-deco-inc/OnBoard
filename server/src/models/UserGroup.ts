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
import { ObjectType, ID, Field, Int, registerEnumType } from "type-graphql";
import { User } from "./User";
import { Timetable } from "./Timetable";

export enum GroupType {
  CourseStudents = 'CourseStudents',
  CourseStaff = 'CourseStaff',
  Class = 'Class',
  StudyRoom = 'StudyRoom',
  DirectMessage = 'DirectMessage',
}
registerEnumType(GroupType, {
  name: "GroupType"
});

@Entity()
@ObjectType()
export class UserGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field()
  name?: string;

  @Column({enum: GroupType, nullable: true})
  @Field()
  type?: GroupType;

  @ManyToMany(() => User, (user) => user.groups, { cascade: true })
  @JoinTable()
  users: Promise<User[]>;

  @ManyToOne(() => Timetable, (t) => t.groups, { nullable: true })
  @Field(() => Timetable, { nullable: true })
  timetable?: Promise<Timetable>;
}

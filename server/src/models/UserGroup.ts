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
  OneToOne,
  TableInheritance,
  ChildEntity,
} from "typeorm";
import { ObjectType, ID, Field, Int, registerEnumType } from "type-graphql";
import { User } from "./User";
import { Timetable } from "./Timetable";
import { Course } from "./Course";

export enum GroupType {
  CourseStudents = "CourseStudents",
  CourseStaff = "CourseStaff",
  Class = "Class",
  StudyRoom = "StudyRoom",
  DirectMessage = "DirectMessage",
}
registerEnumType(GroupType, {
  name: "GroupType",
});

@Entity()
@TableInheritance({ column: { type: "varchar", name: "groupType" } })
export abstract class BaseGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field({nullable: true})
  name?: string;

  @ManyToMany(() => User, (user) => user.groups, { cascade: true })
  @JoinTable()
  users: Promise<User[]>;
}

@ChildEntity()
@ObjectType()
export class CourseGroup extends BaseGroup {

}

@ChildEntity()
@ObjectType() 
export class ClassGroup extends BaseGroup {
  @ManyToOne(() => Timetable, (t) => t.groups, { nullable: true })
  @Field(() => Timetable, { nullable: true })
  timetable?: Promise<Timetable>;
}

@ChildEntity()
@ObjectType()
export class StudyGroup extends BaseGroup {

}

@ChildEntity()
@ObjectType()
export class DMGroup extends BaseGroup {

}
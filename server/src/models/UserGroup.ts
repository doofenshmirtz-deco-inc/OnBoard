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
import { CourseGroupPair } from "./CourseGroupPair";

export enum ClassType {
  Lecture = 'Lecture',
  Tutorial = 'Tutorial',
  Practical = 'Practical',
}
registerEnumType(ClassType, {
  name: "ClassType",
});

export enum GroupType {
  Course = 'course',
  Class = 'class',
  Study = 'study',
  DirectMessage = 'direct_message',
}

@Entity()
@TableInheritance({ column: { type: "enum", enum: GroupType, name: 'groupType' } })
@ObjectType()
export abstract class BaseGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToMany(() => User, (user) => user.groups, { cascade: true })
  @JoinTable()
  users: Promise<User[]>;

  @Column({type: 'enum', enum: GroupType})
  groupType: GroupType;
}

@ChildEntity(GroupType.Course)
@ObjectType()
export class CourseGroup extends BaseGroup {
  @OneToMany(() => CourseGroupPair, p => p.group)
  coursePairs: CourseGroupPair[]
}

@ChildEntity(GroupType.Class)
@ObjectType() 
export class ClassGroup extends BaseGroup {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  type: ClassType;

  @ManyToOne(() => Timetable, (t) => t.classes, { nullable: true })
  @Field(() => Timetable, { nullable: true })
  timetable?: Promise<Timetable>;
}

@ChildEntity(GroupType.Study)
@ObjectType()
export class StudyGroup extends BaseGroup {
  @Column()
  @Field()
  name: string;
}

@ChildEntity(GroupType.DirectMessage)
@ObjectType()
export class DMGroup extends BaseGroup {

}
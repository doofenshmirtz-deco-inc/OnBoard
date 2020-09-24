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
  BeforeInsert,
  Generated,
} from "typeorm";
import {
  ObjectType,
  ID,
  Field,
  Int,
  registerEnumType,
  createUnionType,
  FieldResolver,
} from "type-graphql";
import { User } from "./User";
import { Timetable } from "./Timetable";
import { Course } from "./Course";
import { CourseGroupPair, CourseRole } from "./CourseGroupPair";

export enum ClassType {
  Lecture = "Lecture",
  Tutorial = "Tutorial",
  Practical = "Practical",
}
registerEnumType(ClassType, {
  name: "ClassType",
});

export enum GroupType {
  Course = "course",
  Class = "class",
  Study = "study",
  DirectMessage = "direct_message",
}

@Entity()
@TableInheritance({
  column: { type: "enum", enum: GroupType, name: "groupType" },
})
@ObjectType()
export abstract class BaseGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: Promise<User[]>;

  @Column({ type: "enum", enum: GroupType })
  groupType: GroupType;

  async setUsers(users?: User[]) {
    if (!users) {
      this.users = Promise.resolve([]);
      return;
    }
    this.users = Promise.resolve(users ?? []);
  }

  @Column()
  @Field()
  lastActive: Date;

  @BeforeInsert()
  updateDate() {
    this.lastActive = new Date();
  }

  @Generated("uuid")
  meetingPassword: string;
}

@ChildEntity(GroupType.Course)
@ObjectType()
export class CourseGroup extends BaseGroup {
  @OneToOne(() => CourseGroupPair, (p) => p.group, { eager: true })
  coursePairs: CourseGroupPair;

  @Field(() => String)
  name(): string {
    // TODO
    return "CHANGEME";
    // return this.coursePairs.course.name;
  }
}

@ChildEntity(GroupType.Class)
@ObjectType()
export class ClassGroup extends BaseGroup {
  @Column()
  @Field()
  name: string;

  @Column({ type: "enum", enum: ClassType })
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
export class DMGroup extends BaseGroup {}

export const Group = createUnionType({
  name: "Group",
  types: () => [CourseGroup, ClassGroup, StudyGroup, DMGroup],
});

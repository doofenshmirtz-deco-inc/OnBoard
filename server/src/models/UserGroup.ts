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
  Ctx,
} from "type-graphql";
import { User } from "./User";
import { Course } from "./Course";
import { CourseGroupPair, CourseRole } from "./CourseGroupPair";
import { Context } from "../middleware/Context";

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

  @Column()
  @Generated("uuid")
  @Field()
  meetingPassword: string;
}

@ChildEntity(GroupType.Course)
@ObjectType()
export class CourseGroup extends BaseGroup {
  // @OneToOne(() => CourseGroupPair, (p) => p.group, { eager: true })
  @OneToOne(() => CourseGroupPair, (p) => p.group)
  coursePair: Promise<CourseGroupPair>;
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

  @ManyToOne(() => Course)
  @Field(() => Course)
  course: Course;

  @Column("timestamp", { array: true })
  @Field(() => [Date])
  times: Date[];

  @Column()
  @Field()
  duration: number;
}

@ChildEntity(GroupType.Study)
@ObjectType()
export class StudyGroup extends BaseGroup {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  isPublic: boolean;
}

@ChildEntity(GroupType.DirectMessage)
@ObjectType()
export class DMGroup extends BaseGroup {}

export const Group = createUnionType({
  name: "Group",
  types: () => [CourseGroup, ClassGroup, StudyGroup, DMGroup],
});

import {
  Column,
  PrimaryColumn,
  BaseEntity,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import {
  ObjectType,
  ID,
  Field,
  Int,
  InputType,
  ArgsType,
  registerEnumType,
} from "type-graphql";
import { CourseGroup } from "./UserGroup";
import { Announcement } from "./Announcement";
import { User } from "./User";
import { CourseGroupPair, CourseRole } from "./CourseGroupPair";
import { FolderNode } from "./CoursePageNode";

export enum Semesters {
  One = "Semester One",
  Two = "Semester Two",
  Summer = "Summer Semester",
}
registerEnumType(Semesters, {
  name: "Semesters",
});

export enum CourseLevel {
  NonAward = "Non-Award Study",
  Undergrad = "Undergraduate",
  Postgrad = "Postgraduate",
}
registerEnumType(CourseLevel, {
  name: "CourseLevel",
});

export const CourseColours = ["#751CCE", "#FF5A5F", "#DBAD6A", "#087E8B"];

@Entity()
@ObjectType()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  code: string;

  @Column()
  @Field(() => Int)
  year: number;

  @Column({
    type: "enum",
    enum: Semesters,
  })
  @Field(() => Semesters)
  semester: Semesters;

  @Column()
  @Field()
  name: string;

  @Column({
    type: "enum",
    enum: CourseLevel,
  })
  @Field()
  courseLevel: CourseLevel;

  @OneToMany(() => CourseGroupPair, (p) => p.course)
  groupPairs: Promise<CourseGroupPair[]>;

  @OneToOne(() => FolderNode, { eager: true })
  @JoinColumn()
  @Field(() => FolderNode)
  coursePage: FolderNode;

  @OneToOne(() => FolderNode, { eager: true })
  @JoinColumn()
  @Field(() => FolderNode)
  assesmentPage: FolderNode;

  // TODO validation that user groups are disjoint

  @OneToMany(() => Announcement, (a) => a.course)
  @Field(() => [Announcement], { defaultValue: [] })
  announcements: Promise<Announcement[]>;

  async getGroups(role: CourseRole) {
    return (await this.groupPairs).filter((p) => p.role == role);
  }

  async addGroup(role: CourseRole, group: CourseGroup) {
    const pair = CourseGroupPair.create({
      course: this,
      group,
      role,
    });
    return pair.save();
  }
}

@ObjectType()
export class CourseColor {
  @Field()
  course: Course;

  @Field()
  colour: string;
}

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
import { CourseGroupPair } from "./CourseGroupPair";

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

  @OneToMany(() => CourseGroupPair, p => p.course)
  groupPairs: Promise<CourseGroupPair[]>

  @ManyToOne(() => CourseGroup, { eager: true })
  @JoinTable()
  @Field(() => CourseGroup)
  coordinators: CourseGroup;

  @ManyToOne(() => CourseGroup, { eager: true })
  @JoinTable()
  @Field(() => CourseGroup)
  tutors: CourseGroup;

  @ManyToOne(() => CourseGroup, { eager: true })
  @JoinTable()
  @Field(() => CourseGroup)
  students: CourseGroup;

  // TODO validation that user groups are disjoint

  @OneToMany(() => Announcement, (a) => a.course, { cascade: true })
  @Field(() => [Announcement], { defaultValue: [] })
  announcements: Promise<Announcement[]>;
}

@ArgsType()
export class CoursePK {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  year: number;

  @Field(() => Semesters)
  semester: Semesters;
}

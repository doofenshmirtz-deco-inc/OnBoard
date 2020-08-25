import {
  Column,
  PrimaryColumn,
  BaseEntity,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
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
import { UserGroup } from "./UserGroup";

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
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @PrimaryColumn()
  @Field(() => Int)
  year: number;

  @PrimaryColumn({
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

  @OneToOne(() => UserGroup, { eager: true })
  @JoinColumn()
  @Field()
  coordinators: UserGroup;

  @OneToOne(() => UserGroup, { eager: true })
  @JoinColumn()
  @Field()
  tutors: UserGroup;

  @OneToOne(() => UserGroup, { eager: true })
  @JoinColumn()
  @Field()
  students: UserGroup;

  // TODO validation that user groups are disjoint
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

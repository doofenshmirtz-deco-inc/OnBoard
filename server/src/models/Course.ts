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
import { Announcement } from "./Announcement";
import { User } from "./User";

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

export enum CourseRole {
  Coordinator = 'Coordinators',
  Tutor = 'Tutors',
  Student = 'Students'
};


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

  @ManyToOne(() => UserGroup, g => g.course, { eager: true })
  @JoinTable()
  @Field(() => UserGroup)
  coordinators: UserGroup;

  @ManyToOne(() => UserGroup, g => g.course, { eager: true }) 
  @JoinTable()
  @Field(() => UserGroup)
  tutors: UserGroup;

  @ManyToOne(() => UserGroup, g => g.course, { eager: true })
  @JoinTable()
  @Field(() => UserGroup)
  students: UserGroup;

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

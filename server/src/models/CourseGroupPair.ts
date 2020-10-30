/**
 * Model to represent the relationship between a course and student, including the role a student has in a course.
 */

import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Course } from "./Course";
import { registerEnumType } from "type-graphql";
import { CourseGroup } from "./UserGroup";

export enum CourseRole {
  Coordinator = "Coordinators",
  Tutor = "Tutors",
  Student = "Students",
}
registerEnumType(CourseRole, {
  name: "CourseRole",
});

@Entity()
export class CourseGroupPair extends BaseEntity {
  @ManyToOne(() => Course, (c) => c.groupPairs, {
    primary: true,
  })
  @JoinColumn()
  course: Course;

  @PrimaryColumn({ type: "enum", enum: CourseRole })
  role: CourseRole;

  @OneToOne(() => CourseGroup, (g) => g.coursePair)
  @JoinColumn()
  group: CourseGroup;
}

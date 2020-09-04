import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Course } from "./Course";
import { registerEnumType } from "type-graphql";
import { group } from "console";
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
  @ManyToOne(() => Course, (c) => c.groupPairs, { primary: true })
  course: Course;

  @PrimaryColumn({ type: "enum", enum: CourseRole })
  role: CourseRole;

  @ManyToOne(() => CourseGroup, (g) => g.coursePairs)
  group: CourseGroup;
}

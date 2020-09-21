import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
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
    //cascade: true,
  })
  @JoinColumn()
  course: Course;

  @PrimaryColumn({ type: "enum", enum: CourseRole })
  role: CourseRole;

  @OneToOne(() => CourseGroup, (g) => g.coursePairs)
  @JoinColumn()
  group: CourseGroup;
}

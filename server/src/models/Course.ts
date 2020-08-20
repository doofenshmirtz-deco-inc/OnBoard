import { Column, PrimaryColumn, BaseEntity, Entity, OneToMany } from "typeorm";
import {ObjectType, ID, Field, Int} from "type-graphql";
import {Permission} from "./User";

enum Semesters {
	One = "Semester One",
	Two = "Semester Two",
	Summer = "Summer Semester"
}


enum CourseLevel {
	NonAward = "Non-Award Study",
	Undergrad = "Undergraduate",
	Postgrad = "Postgraduate",
}

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
		enum: Semesters
	})
	@Field(() => Semesters)
	semester: Semesters;

	@Column()
	@Field()
	name: string;

	@Column({
		type: "enum",
		enum: CourseLevel
	})
	@Field()
	courseLevel: CourseLevel; 

	// TODO course coordinator, tutors, students
	@Column()
	@OneToMany(type => Permission, permission => permission.course)
	users: [Permission]
}

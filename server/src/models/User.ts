import { Column, PrimaryColumn, BaseEntity, Entity, ManyToOne, OneToMany } from "typeorm";
import { IsEmail } from "class-validator";
import {ObjectType, ID, Field} from "type-graphql";
import {Course} from "./Course";

enum CoursePermissions {
	Admin, // Coordinator permissions but not listed as coordinator
	Coordinator,
	Tutor,
	Student
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
	@PrimaryColumn()
	@Field(() => ID)
	id: string;  // From firebase auth

	@Column()
	@Field()
	name: string;

	@Column()
	@IsEmail()
	@Field()
	email: string;

	@Column()
	@OneToMany(() => Permission, permission => permission.user)
	permissions: [Permission]
}


@Entity()
export class Permission extends BaseEntity {
	@PrimaryColumn()
	@ManyToOne(() => User)
	user: User;

	@PrimaryColumn()
	@ManyToOne(() => Course)
	course: Course;

	@Column({
		type: "enum",
		enum: CoursePermissions
	})
	coursePermission: CoursePermissions;
}


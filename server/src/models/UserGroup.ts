import { Column, PrimaryColumn, BaseEntity, Entity, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import {ObjectType, ID, Field, Int} from "type-graphql";
import {User} from "./User";

@Entity()
@ObjectType()
export class UserGroup extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id: number;

	@ManyToMany(() => User, user => user.groups)
	@JoinTable()
	users: Promise<User[]>;
}



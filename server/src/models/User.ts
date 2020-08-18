import { Column, PrimaryColumn, BaseEntity, Entity } from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	id: number;  // From firebase auth

	@Column()
	name: string;

	@Column()
	@IsEmail()
	email: string;
}

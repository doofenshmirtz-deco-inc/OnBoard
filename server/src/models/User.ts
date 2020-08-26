import {
  Column,
  PrimaryColumn,
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IsEmail } from "class-validator";
import { ObjectType, ID, Field } from "type-graphql";
import { UserGroup } from "./UserGroup";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id: string; // From firebase auth

  @Column()
  @Field()
  name: string;

  @Column()
  @IsEmail()
  @Field()
  email: string;

  @Column()
  calendarUrl: string;

  @ManyToMany(() => UserGroup, (group) => group.users)
  groups: Promise<UserGroup[]>;
}

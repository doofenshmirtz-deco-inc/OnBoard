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
import { BaseGroup } from "./UserGroup";
import { Announcement } from "./Announcement";

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

  @ManyToMany(() => BaseGroup, (group) => group.users, { cascade: true })
  groups: Promise<BaseGroup[]>;
}

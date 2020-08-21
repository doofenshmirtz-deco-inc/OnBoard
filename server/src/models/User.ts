import { Column, PrimaryColumn, BaseEntity, Entity } from "typeorm";
import { IsEmail } from "class-validator";
import { ObjectType, ID, Field } from "type-graphql";

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
}

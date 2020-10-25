import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  ChildEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import {
  ObjectType,
  ID,
  Field,
  createUnionType,
  InputType,
} from "type-graphql";
import { DMGroup } from "./UserGroup";

export enum CoursePageNodeTypes {
  Text = "text",
  Heading = "heading",
  Folder = "folder",
}

@Entity()
@TableInheritance({
  column: { type: "enum", enum: CoursePageNodeTypes, name: "nodeType" },
})
@ObjectType()
export abstract class BaseNode extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: "enum", enum: CoursePageNodeTypes })
  nodeType: CoursePageNodeTypes;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  link?: string;

  // TODO maybe custom type checking
  // TODO so bad v bad fix me
  @ManyToOne(() => BaseNode, (node) => node.children)
  parent: Promise<BaseNode>;

  // TODO this is bad!!
  // TODO maybe custom type checking lmao
  @OneToMany(() => BaseNode, (node) => node.parent)
  children: Promise<BaseNode[]>;
}

@ChildEntity(CoursePageNodeTypes.Text)
@ObjectType()
export class TextNode extends BaseNode {
  @Column()
  @Field()
  text: string;
}

@ChildEntity(CoursePageNodeTypes.Heading)
@ObjectType()
export class HeadingNode extends BaseNode {}

@ChildEntity(CoursePageNodeTypes.Folder)
@ObjectType()
export class FolderNode extends BaseNode {}

@InputType()
export abstract class BaseNodeInput {
  @Field({ nullable: true })
  id?: number;

  @Field()
  title: string;

  @Field()
  link: string;

  @Field()
  parent: number;
}

@InputType()
export class TextNodeInput extends BaseNodeInput {
  @Field()
  text: string;
}

@InputType()
export class FolderNodeInput extends BaseNodeInput {
  @Field(() => [String])
  children: string[];
}

export const Node = createUnionType({
  name: "Node",
  types: () => [TextNode, HeadingNode, FolderNode],
});

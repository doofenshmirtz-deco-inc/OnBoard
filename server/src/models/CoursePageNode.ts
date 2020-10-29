/**
 * Model to denote the nodes in a course or assessment page
 */

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

  // TODO: This could benifit from runtime type checking
  @ManyToOne(() => BaseNode, (node) => node.children, { cascade: true })
  parent: Promise<BaseNode>;

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

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  parent?: number;
}

@InputType()
export class TextNodeInput extends BaseNodeInput {
  @Field({ nullable: true })
  text?: string;
}

@InputType()
export class FolderNodeInput extends BaseNodeInput {
  @Field(() => [String], { nullable: true })
  children?: string[];
}

export const Node = createUnionType({
  name: "Node",
  types: () => [TextNode, HeadingNode, FolderNode],
});

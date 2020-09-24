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
import { ObjectType, ID, Field, createUnionType } from "type-graphql";
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

  @ManyToOne(() => FolderNode, (node) => node.children)
  @Field({ nullable: true })
  parent: FolderNode;
}

@ChildEntity(CoursePageNodeTypes.Text)
@ObjectType()
export class TextNode extends BaseNode {
  text: string;
}

@ChildEntity(CoursePageNodeTypes.Heading)
@ObjectType()
export class HeadingNode extends BaseNode {}

@ChildEntity(CoursePageNodeTypes.Folder)
@ObjectType()
export class FolderNode extends BaseNode {
  @OneToMany(() => BaseNode, (node) => node.parent)
  children: Promise<BaseNode[]>;
}

export const Node = createUnionType({
  name: "Node",
  types: () => [TextNode, HeadingNode, DMGroup],
});

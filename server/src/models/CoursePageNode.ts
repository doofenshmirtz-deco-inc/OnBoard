import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  Tree,
  TableInheritance,
  ChildEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ObjectType, ID, Field } from "type-graphql";

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

  @ManyToOne(() => BaseNode, (node) => node.children)
  // @Field({ nullable: true })
  parent: BaseNode;

  @OneToMany(() => BaseNode, (node) => node.parent)
  children: Promise<BaseNode[]>;
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
export class FolderNode extends BaseNode {}

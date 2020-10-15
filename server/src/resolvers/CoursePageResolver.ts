import {
  Resolver,
  FieldResolver,
  Root,
  Arg,
  Query,
  Authorized,
  Mutation,
  Args,
} from "type-graphql";
import {
  FolderNode,
  BaseNode,
  Node,
  FolderNodeInput,
  BaseNodeInput,
  HeadingNode,
  TextNode,
  TextNodeInput,
} from "../models/CoursePageNode";

@Resolver(() => FolderNode)
export class FolderNodeResolver {
  @FieldResolver(() => [Node])
  async children(@Root() folder: FolderNode) {
    let children = await folder.children;
    return children ? children : [];
  }
}

@Resolver(() => BaseNode)
export class NodeResolver {
  @Query(() => Node, { nullable: true })
  @Authorized()
  async node(@Arg("id") id: number) {
    return (await BaseNode.findByIds([id]))[0];
  }

  @FieldResolver(() => FolderNode, { nullable: true })
  @Authorized()
  async parent(@Root() node: BaseNode) {
    let parent = await node.parent;
    return parent;
  }

  @Mutation(() => BaseNode)
  @Authorized()
  async deleteNode(@Arg("id") id: number) {
    return await BaseNode.delete({ id });
  }

  @Mutation(() => FolderNode)
  @Authorized()
  async editFolderNode(@Args() data: FolderNodeInput) {
    const children = BaseNode.findByIds(data.children);
    const parent = BaseNode.findOne({ id: data.parent });

    if (!data.id)
      return await FolderNode.create({
        ...data,
        children,
        parent,
      }).save();
    else {
      return await FolderNode.update(
        { id: data.id },
        {
          ...data,
          children,
          id: undefined,
          parent: undefined,
        }
      );
    }
  }

  @Mutation(() => HeadingNode)
  @Authorized()
  async titleNode(@Args() data: BaseNodeInput) {
    const parent = BaseNode.findOne({ id: data.parent });

    if (!data.id)
      return await HeadingNode.create({
        ...data,
        parent,
      }).save();
    else {
      return await HeadingNode.update(
        { id: data.id },
        {
          ...data,
          id: undefined,
          parent: undefined,
        }
      );
    }
  }

  @Mutation(() => TextNode)
  @Authorized()
  async textNode(@Args() data: TextNodeInput) {
    const parent = BaseNode.findOne({ id: data.parent });

    if (!data.id)
      return await TextNode.create({
        ...data,
        parent,
      }).save();
    else {
      return await TextNode.update(
        { id: data.id },
        {
          ...data,
          id: undefined,
          parent: undefined,
        }
      );
    }
  }
}

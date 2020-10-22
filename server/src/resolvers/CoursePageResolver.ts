import {
  Resolver,
  FieldResolver,
  Root,
  Arg,
  Query,
  Authorized,
  Mutation,
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
  async editFolderNode(@Arg("data") data: FolderNodeInput) {
    const children = BaseNode.findByIds(data.children!);
    const parent = BaseNode.findOne({ id: data.parent });

    if (!data.id) {
      console.log("here");
      const node = new TextNode();
      node.title = data.title!;
      node.link = data.link!;
      await node.save();
      node.children = children!;
      node.parent = Promise.resolve((await parent)!);
      return await node.save();
    } else {
      const node = await TextNode.findOne({ id: data.parent });
      if (data.children) (await node?.children)!.concat(await children);

      data = {
        ...data,
        children: undefined,
      };

      await TextNode.save([
        {
          ...node,
          ...JSON.parse(JSON.stringify(data)),
        } as any,
      ]);

      return await TextNode.findOne({ id: data.id });
    }
  }

  @Mutation(() => TextNode)
  @Authorized()
  async editTextNode(@Arg("data") data: TextNodeInput) {
    const parent = FolderNode.findOne({ id: data.parent });

    if (!data.id) {
      console.log("here");
      const node = new TextNode();
      node.title = data.title!;
      node.link = data.link!;
      node.text = data.text!;
      await node.save();
      node.parent = Promise.resolve((await parent)!);
      return await node.save();
    } else {
      const node = await TextNode.findOne({ id: data.parent });

      await TextNode.save([
        {
          ...node,
          ...JSON.parse(JSON.stringify(data)),
        } as any,
      ]);

      return await TextNode.findOne({ id: data.id });
    }
  }
}

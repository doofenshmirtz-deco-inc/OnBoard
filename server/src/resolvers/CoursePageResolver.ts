import { Resolver, FieldResolver, Root } from "type-graphql";
import { FolderNode, BaseNode, Node } from "../models/CoursePageNode";

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
  @FieldResolver(() => FolderNode, { nullable: true })
  async parent(@Root() node: BaseNode) {
    let parent = await node.parent;
    return parent;
  }
}

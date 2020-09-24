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

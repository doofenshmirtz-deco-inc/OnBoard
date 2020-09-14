import { Resolver, FieldResolver, Root } from "type-graphql";
import { FolderNode, BaseNode } from "../models/CoursePageNode";
import { getManager } from "typeorm";

@Resolver(() => FolderNode)
export class FolderNodeResolver {
  @FieldResolver(() => [BaseNode])
  async children(@Root() folder: FolderNode) {
    let children = await folder.children;
    return children ? children : [];
  }
}

import { Resolver, Mutation, Int, Arg } from "type-graphql";
import { ReadStream } from "typeorm/platform/PlatformTools";
import { createWriteStream, mkdirSync } from "fs";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import shortid from "shortid";
import { mkdir } from "fs";
import { join, dirname } from "path";
import filenamify from "filenamify";
import { cwd } from "process";

export const UPLOAD_URL_ROOT = "/api/uploads";
export const UPLOAD_PATH_ROOT = join(cwd(), "uploads");
export const createUploadPath = (filename: string) => {
  const id = shortid.generate();
  const safeName = filenamify(filename);
  const url = `${UPLOAD_URL_ROOT}/${id}/${safeName}`;
  const path = join(`${UPLOAD_PATH_ROOT}`, id, safeName);
  mkdirSync(dirname(path), { recursive: true });

  return { url, path };
};

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async singleUpload(
    @Arg("file", () => GraphQLUpload) file: Promise<FileUpload>
  ) {
    const { createReadStream, filename, mimetype, encoding } = await file;

    const { url, path } = createUploadPath(filename);
    console.log(url);
    console.log(path);

    const stream = createReadStream();
    return new Promise((resolve, reject) =>
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => resolve(url))
        .on("error", reject)
    );
  }
}

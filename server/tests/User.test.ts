import { Connection, getConnection } from "typeorm";
import { createTestConnection } from "./TestDatabase";
import { useSeeding, runSeeder } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { UserResolver } from "../src/resolvers/UserResolver";
import TestDataSeeder from "../src/db/seeds/TestDataSeeder";

const emptyReqRes = {
  req: {} as any,
  res: {} as any,
  connection: {} as any,
};

let connection: Connection;
let userResolver: UserResolver;

beforeAll(async () => {
  connection = await createTestConnection();
  userResolver = new UserResolver();
  await useSeeding();
  await runSeeder(TestDataSeeder);
});

afterAll(async () => {
  await getConnection().close();
});

describe("User Resolver", () => {
  it("user query", async (done) => {
    const user = await userResolver.user("doof");
    if (!user) done.fail("user is not defined");

    expect(user!.name).toBe("Heinz Doofenshmirtz");
    expect(user!.email).toBe("heinz@evilinc.com");
    done();
  });

  it("users query", async () => {
    let users = await userResolver.users({
      orderBy: "name",
      order: "DESC",
    });
    expect(users[0].name.localeCompare(users[1].name)).toBe(1);

    users = await userResolver.users({
      orderBy: "id",
      order: "ASC",
      limit: 3,
    });

    expect(users.length).toBe(3);
    expect(users[0].id.localeCompare(users[1].id)).toBe(-1);
  });

  it("me query", async (done) => {
    const user = await userResolver.me({
      ...emptyReqRes,
      payload: {
        uid: "doof",
      },
    });
    if (!user) done.fail("user is not defined");

    expect(user!.name).toBe("Heinz Doofenshmirtz");
    expect(user!.email).toBe("heinz@evilinc.com");
    done();
  });
});

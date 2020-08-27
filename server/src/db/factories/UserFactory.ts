import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { User } from "../../models/User";

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const user = new User();
  user.id = faker.random.uuid();
  user.name = `${firstName} ${lastName}`;
  user.email = `${firstName}@decodoof.net`;

  return user;
});

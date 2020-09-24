import Faker from "faker";
import { define, factory } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { User } from "../../models/User";

define(User, (
  faker: typeof Faker,
  context?: {
    id: string;
    name: string;
    email: string;
  }
) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const user = new User();
  user.id = context && context.id ? context.id : faker.random.uuid();
  user.name =
    context && context.name ? context.name : `${firstName} ${lastName}`;
  user.email =
    context && context.email
      ? context.email
      : context && context.name
      ? `${context.name.split(" ")[0].toLowerCase()}@decodoff.net`
      : `${firstName.toLowerCase()}@decodoof.net`;

  return user;
});

/**
 * Factory for a user. Accepts some context and defaults may be used if not
 * provided.
 */

import { define } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { User } from "../../models/User";

// Creates a new user with random properties.
define(User, (
  faker,
  context?: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
  }
) => {
  // Creates a new user with random names and gender.
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  // Attaches id, name, email, and avatar from defaults or context.
  const user = new User();
  user.id = context && context.uid ? context.uid : faker.random.uuid();
  user.name =
    context && context.name ? context.name : `${firstName} ${lastName}`;
  user.email =
    context && context.email
      ? context.email
      : context && context.name
      ? `${context.name.split(" ")[0].toLowerCase()}@decodoff.net`
      : `${firstName.toLowerCase()}@decodoof.net`;
  // Default to a generic user icon.
  user.avatar =
    context && context.avatar
      ? context.avatar
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return user;
});

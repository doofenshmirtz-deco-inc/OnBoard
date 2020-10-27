/**
 * Factory for an announcement. Creates a lorem ipsum announcement with author
 * chosen from a given list of users.
 */

import { define } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Announcement } from "../../models/Announcement";
import { User } from "../../models/User";

// Creates a new announcement with lorem ipsum words and titles.
define(Announcement, async (faker, ctx?: { authors: User[] }) => {
  if (ctx == null || ctx.authors == null || ctx.authors.length == 0)
    throw new Error(
      "Announcement factory must be given context with author users"
    );

  const announcement = new Announcement();
  announcement.html = faker.lorem.paragraph();
  announcement.title = faker.lorem.words();
  announcement.author = faker.random.arrayElement(ctx.authors);

  return announcement;
});

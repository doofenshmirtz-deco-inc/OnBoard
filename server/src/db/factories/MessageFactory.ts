/**
 * Factory for a message. Accepts a list of users and the sender is randomly
 * chosen from the users. Text is lorem ipsum.
 */

import { define } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { BaseGroup } from "../../models/UserGroup";
import { Message } from "../../models/Message";

// Creates a new message to the given group, sent from a random user
// in the group.
define(Message, async (faker, context?: { group: Promise<BaseGroup> }) => {
  if (!context) throw new Error("Message seeder requires group");

  const group = await context.group;

  return Message.create({
    group,
    text: faker.lorem.words(faker.random.number({ min: 1, max: 10 })),
    user: (await group.users)[
      faker.random.number({
        min: 0,
        max: (await group.users).length - 1,
      })
    ],
  });
});

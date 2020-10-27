import { createConnection } from "typeorm";

export const createTestConnection = () => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "onboard",
    password: "y@yCKiL2oUmJ",
    database: "onboardtest",
    synchronize: true,
    dropSchema: false,
    logging: false,
    entities: ["./src/models/*.ts"],
  });
};

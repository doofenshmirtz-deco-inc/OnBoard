import { createConnection } from "typeorm";

export const createTestConnection = async () => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "onboard",
    password: "y@yCKiL2oUmJ",
    database: "onboard-test",
    synchronize: true,
    dropSchema: true,
    logging: false,
	entities: ["./src/models/*.ts"],
  });
}

module.exports = {
  type: "postgres",
  host: process.env.NODE_ENV == "production" ? "db" : "localhost",
  port: 5432,
  username: "onboard",
  password: "y@yCKiL2oUmJ",
  database: "onboard",
  entities:
    process.env.NODE_ENV == "production"
      ? ["./src/models/*.js"]
      : ["./src/models/*.ts"],
  seeds: ["./src/db/seeds/*.ts"],
  factories: ["./src/db/factories/*.ts"],
  synchronize: true,
};

module.exports = {
  type: "postgres",
  host: process.env.NODE_ENV == "development" ? "localhost" : "db",
  port: 5432,
  username: "onboard",
  password: "y@yCKiL2oUmJ",
  database: "onboard",
  entities:
    process.env.NODE_ENV == "development"
      ? ["./src/models/*.ts"]
      : ["./src/models/*.js"],
  seeds:
    process.env.NODE_ENV == "development"
      ? ["./src/seeds/*.ts"]
      : ["./src/seeds/*.js"],
  factories:
    process.env.NODE_ENV == "development"
      ? ["./src/factories/*.ts"]
      : ["./src/factories/*.js"],
  synchronize: true,
};

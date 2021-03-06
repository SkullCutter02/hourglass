module.exports = {
  type: "postgres",
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: ["src/entity/**/*.ts", __dirname + "/build/entity/**/*.js"],
  migrations: ["src/migration/**/*.ts", __dirname + "/build/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.ts", __dirname + "/build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
import mysql2 from "mysql2";
import path from "path";

config({ path: path.join(__dirname, "..", ".env") });

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3308,
  // host: "localhost",
  // username: "kim",
  // password: "1234qwer",
  // database: "test",
  // port: 3308,
  dialectModule: mysql2,
});

export default sequelize;

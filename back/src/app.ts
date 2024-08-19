import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import todo from "./controllers/todo2";
import Todo from "./models/todo";
import sequelize from "./models/database";
import path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });

(async () => {
  sequelize.addModels([Todo]);
  await sequelize.sync({ force: true });
})();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT ? process.env.PORT : "3080");

app.use("/api/todo", todo);
app.get("/", (req, res) => {
  res.status(200).send("AWS's Members");
});

app.listen(app.get("port"), () => {
  console.log("port opens ", app.get("port"));
});
export default app;

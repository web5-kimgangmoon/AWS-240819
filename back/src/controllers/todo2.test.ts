import request from "supertest";
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
// import path from "path";

config();
// { path: path.join(__dirname, "..", ".env") }

import router from "./todo2";
import Todo from "../models/todo";

// jest.mock("sequelize-typescript");
// jest.mock("../services/todo2", () => ({
//   add: jest.fn().mockReturnValue(1),
//   getList: jest.fn().mockResolvedValue(1).mockRejectedValue(2),
//   patchTodo: jest.fn((num: number) => {
//     if (num == 1) return "one";
//     if (num == 2) return "two";
//     if (num > 2) return "much";
//   }),
//   deleteTodo: jest.fn(),
// }));
jest.mock("sequelize-typescript", () => {
  const actual = jest.requireActual("sequelize-typescript");
  return {
    ...actual,
    Sequelize: jest.fn(() => ({
      sync: jest.fn(),
    })),
    Model: class MockModel extends actual.Model {
      static create = jest.fn();
      static findByPk = jest.fn();
      static findAll = jest.fn();
      // constructor(...args: any[]) {
      //   super(args);
      //   this.save = jest.fn();
      //   this.destory = jest.fn();
      // }
    },
  };
});

describe("Test todo", () => {
  let app: Express;
  let todoInstance: Todo;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use("/todo", router);

    todoInstance = {
      id: 1,
      title: "test todo list",
      isCompleted: false,
      save: jest.fn(),
      destroy: jest.fn(),
    } as unknown as Todo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test Mock", async () => {
    const mockFunc = jest.fn().mockReturnValue("hi?");

    // console.log(Sequelize);
    const sequelize = new Sequelize({
      dialect: "mysql",
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3308,
    });
    // await sequelize.addModels([Todo]);
    await sequelize.sync({ force: true });
    expect(mockFunc()).toBe("hi?");
  });

  test("Test Add Todo Item", async () => {
    (Todo.create as jest.Mock).mockResolvedValue(todoInstance);

    const response = await request(app)
      .post("/todo")
      .send({ title: "test todo list" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: "test todo list",
      isCompleted: false,
    });
  });

  test("Test Get List", async () => {
    (Todo.findAll as jest.Mock).mockResolvedValue([todoInstance]);
    const response = await request(app).get("/todo");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "test todo list",
        isCompleted: false,
      },
    ]);
  });

  test("Test Update Todo Item", async () => {
    (Todo.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      title: "test todo list",
      isCompleted: true,
      save: jest.fn(),
    });
    const response = await request(app)
      .patch("/todo")
      .send({ id: 1, title: "test todo list", isCompleted: true });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: "test todo list",
      isCompleted: true,
    });
  });
  test("Test Delete Todo Item", async () => {
    (Todo.findByPk as jest.Mock).mockResolvedValue(todoInstance);
    (Todo.findAll as jest.Mock).mockResolvedValue([]);
    const response = await request(app).delete("/todo/1");
    // .send({ id: 1, title: "test todo list", isCompleted: true });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  test("Test Add Todo Items", async () => {
    (Todo.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: "test todo list",
        isCompleted: false,
      },
      {
        id: 2,
        title: "test todo list",
        isCompleted: false,
      },
    ]);

    await request(app).post("/todo").send({ title: "test todo list" });
    await request(app).post("/todo").send({ title: "test todo list" });
    const response = await request(app).get("/todo");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "test todo list",
        isCompleted: false,
      },
      {
        id: 2,
        title: "test todo list",
        isCompleted: false,
      },
    ]);
  });
  test("Test Failed Add Todo Item", async () => {
    const response = await request(app).post("/todo").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errorMessage: "plz input title",
    });
  });
  // test("Test get Todo List", async () => {
  //   // await request(app).post("/todo").send({ title: "test todo list1" });
  //   await request(app).post("/todo").send({ title: "test todo list2" });
  //   const response = await request(app).get("/todo");
  //   expect(response.status).toBe(201);
  //   expect(response.body).toEqual([
  //     { id: 1, title: "test todo list1", isCompleted: false },
  //     { id: 2, title: "test todo list2", isCompleted: false },
  //   ]);
  // });
  // test("Test delete Todo List", async () => {
  //   // await request(app).post("/todo").send({ title: "test todo list1" });
  //   // await request(app).post("/todo").send({ title: "test todo list2" });
  //   const deleteTodo = await request(app)
  //     .delete("/todo/delete")
  //     .send({ id: 2 });
  //   console.log(deleteTodo.body);
  //   expect(deleteTodo.status).toBe(201);
  //   expect(deleteTodo.body).toEqual({
  //     id: 2,
  //     title: "test todo list2",
  //     isCompleted: false,
  //   });
  //   const response = await request(app).get("/todo");
  //   expect(response.status).toBe(201);
  //   expect(response.body).toEqual([
  //     { id: 1, title: "test todo list1", isCompleted: false },
  //   ]);
  // });
  // test("Test complete Todo List", async () => {
  //   await request(app).post("/todo").send({ title: "test todo list3" });
  //   //   await request(app).post("/todo").send({ title: "test todo list2" });
  //   const completeTodo = await request(app)
  //     .put("/todo/complete")
  //     .send({ id: 1 });
  //   expect(completeTodo.status).toBe(201);
  //   expect(completeTodo.body).toEqual({
  //     id: 1,
  //     title: "test todo list1",
  //     isCompleted: true,
  //   });
  //   const response = await request(app).get("/todo");
  //   expect(response.status).toBe(201);
  //   expect(response.body).toEqual([
  //     { id: 1, title: "test todo list1", isCompleted: true },
  //     { id: 3, title: "test todo list3", isCompleted: false },
  //   ]);
  // });
});

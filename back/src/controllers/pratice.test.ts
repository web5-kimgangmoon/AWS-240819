import request from "supertest";
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";

config({ path: path.join(__dirname, "..", ".env") });

import router from "./todo2";
import Todo from "../models/todo";
import path from "path";

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
      //     super(args);
      //     this.save = jest.fn();
      //     this.destory = jest.fn();
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

    const sequelize = new Sequelize({
      dialect: "mysql",
      host: "localhost",
      username: "kim",
      password: "1234qwer",
      database: "test",
      port: 3308,
    });

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
});

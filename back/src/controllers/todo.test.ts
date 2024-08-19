// import request from "supertest";
// import express, { Express } from "express";
// import router from "./todo";

describe("Test todo", () => {
  test("empty", () => {});
  //   let app: Express;
  //   beforeEach(() => {
  //     app = express();
  //     app.use(express.json());
  //     app.use(express.urlencoded({ extended: false }));
  //     app.use("/todo", router);
  //   });
  //   test("Test Add Todo Item", async () => {
  //     const response = await request(app)
  //       .post("/todo")
  //       .send({ title: "test todo list1" });
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual({
  //       id: 1,
  //       title: "test todo list1",
  //       isCompleted: false,
  //     });
  //   });
  //   test("Test get Todo List", async () => {
  //     // await request(app).post("/todo").send({ title: "test todo list1" });
  //     await request(app).post("/todo").send({ title: "test todo list2" });
  //     const response = await request(app).get("/todo");
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual([
  //       { id: 1, title: "test todo list1", isCompleted: false },
  //       { id: 2, title: "test todo list2", isCompleted: false },
  //     ]);
  //   });
  //   test("Test delete Todo List", async () => {
  //     // await request(app).post("/todo").send({ title: "test todo list1" });
  //     // await request(app).post("/todo").send({ title: "test todo list2" });
  //     const deleteTodo = await request(app)
  //       .delete("/todo/delete")
  //       .send({ id: 2 });
  //     console.log(deleteTodo.body);
  //     expect(deleteTodo.status).toBe(201);
  //     expect(deleteTodo.body).toEqual({
  //       id: 2,
  //       title: "test todo list2",
  //       isCompleted: false,
  //     });
  //     const response = await request(app).get("/todo");
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual([
  //       { id: 1, title: "test todo list1", isCompleted: false },
  //     ]);
  //   });
  //   test("Test complete Todo List", async () => {
  //     await request(app).post("/todo").send({ title: "test todo list3" });
  //     //   await request(app).post("/todo").send({ title: "test todo list2" });
  //     const completeTodo = await request(app)
  //       .put("/todo/complete")
  //       .send({ id: 1 });
  //     expect(completeTodo.status).toBe(201);
  //     expect(completeTodo.body).toEqual({
  //       id: 1,
  //       title: "test todo list1",
  //       isCompleted: true,
  //     });
  //     const response = await request(app).get("/todo");
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual([
  //       { id: 1, title: "test todo list1", isCompleted: true },
  //       { id: 3, title: "test todo list3", isCompleted: false },
  //     ]);
  //   });
});

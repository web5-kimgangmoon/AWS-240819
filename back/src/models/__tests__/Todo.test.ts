import sequelize from "../database";
import Todo from "../todo";
import { config } from "dotenv";

config();

describe("Todo Test", () => {
  beforeAll(async () => {
    sequelize.addModels([Todo]);
    await sequelize.sync({ force: true });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("testing", () => {
    console.log("test");
    expect(true).toBe(true);
  });

  test("create new todo", async () => {
    const todo = await Todo.create({ title: "study TDD" });
    await Todo.create({ title: "study SDD" });
    expect(todo.id).toBe(1);
    expect(todo.title).toBe("study TDD");
    expect(todo.isCompleted).toBe(false);
  });

  test("find todo by primary key", async () => {
    // const todo = await Todo.findOne({
    //   where:{id:1}
    // })
    const todo = await Todo.findByPk(1);
    expect(todo).not.toBeNull();
    expect(todo?.id).toBe(1);
    expect(todo?.title).toBe("study TDD");
    expect(todo?.isCompleted).toBe(false);
  });
  test("update todo by primary key", async () => {
    const update = await Todo.update(
      { isCompleted: true },
      { where: { id: 1 } }
    );
    // console.log(update);
    // Todo.update({title:"Hello world"}, {where:{id:1}},)
    // expect(update).toEqual([1]);
    // const todo = await Todo.findByPk(1);
    // expect(todo?.title).toBe("Hello world");
    const todo = (await Todo.findByPk(1)) as Todo;
    todo.isCompleted = true;
    await todo.save();

    const result = await Todo.findByPk(1);
    expect(result?.id).toBe(1);
    expect(result?.title).toBe("study TDD");
    expect(result?.isCompleted).toBe(true);
  });

  test("delete todo by primary key", async () => {
    const todo = (await Todo.findByPk(1)) as Todo;
    await todo.destroy();

    const result = await Todo.findByPk(1);
    expect(result).toBeNull();
    // const cnt = await Todo.destroy();
    // const todo = await Todo.findByPk(2);
    // expect(todo).toBeNull();
  });
});

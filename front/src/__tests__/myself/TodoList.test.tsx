import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../../components/TodoList";

describe("Test Todo List", () => {
  // beforeEach(() => render(<TodoList />));
  // test("render Todo List", () => {
  //   // render(<TodoList />);
  //   const titleElem = screen.getByText(/Todo List/i);
  //   expect(titleElem).toBeInTheDocument();
  //   expect(titleElem.tagName).toBe("H1");
  // });
  // test("include input Element", () => {
  //   // render(<TodoList />);
  //   const inputElem = screen.getByRole("textbox");
  //   expect(inputElem).toBeInTheDocument();
  // });

  // test("input text", () => {
  //   // render(<TodoList />);
  //   const inputElem: HTMLInputElement = screen.getByRole("textbox");
  //   expect(inputElem).toBeInTheDocument();
  //   fireEvent.change(inputElem, { target: { value: "input test" } });
  //   expect(inputElem.value).toEqual("input test");
  // });

  // test("Include Add Button", () => {
  //   const buttonElem: HTMLButtonElement = screen.getByRole("button", {
  //     name: "Add Todo",
  //   });
  //   expect(buttonElem).toBeInTheDocument();
  // });

  // test("Add New Todo", () => {
  //   const buttonElem: HTMLButtonElement = screen.getByRole("button", {
  //     name: "Add Todo",
  //   });
  //   const list: HTMLUListElement = screen.getByRole("list");
  //   expect(buttonElem).toBeInTheDocument();
  //   expect(list).toBeInTheDocument();

  //   const oldLength = list.children.length;

  //   fireEvent.click(buttonElem);
  //   expect(list.children.length).toEqual(oldLength + 1);

  //   // const oldTodoList: HTMLLIElement[] = screen.getAllByRole("listitem");
  //   // oldTodoList.forEach((item) => expect(item).toBeInTheDocument());

  //   // fireEvent.click(buttonElem);

  //   // const newTodoList: HTMLLIElement[] = screen.getAllByRole("listitem");
  //   // newTodoList.forEach((item) => expect(item).toBeInTheDocument());
  //   // expect(newTodoList.length).toEqual(oldTodoList.length + 1);
  // });
  // test("Add New TodoList", () => {
  //   const tempList = ["temp1", "tempJack", "tempBang"];
  //   const inputElem: HTMLInputElement = screen.getByRole("textbox");
  //   const todoBtn: HTMLButtonElement = screen.getByRole("button", {
  //     name: "Add Todo",
  //   });
  //   for (const item of tempList) {
  //     fireEvent.change(inputElem, { target: { value: item } });
  //     fireEvent.click(todoBtn);
  //   }
  //   for (const item of tempList) {
  //     const elem = screen.getByText(item);
  //     expect(elem).toBeInTheDocument();
  //     expect(elem.tagName).toBe("LI");
  //   }
  // });
  test("", () => {});
});

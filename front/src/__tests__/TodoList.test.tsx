import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TodoList from "../components/TodoList";
import instance from "../lib/axios";

const mock = new MockAdapter(instance);
const client = new QueryClient();
const data = [{ id: 1, title: "test todo list", isCompleted: false }];

describe("Test Todo List", () => {
  beforeEach(() => {
    mock.onGet("/todo").reply(200, data);
    render(
      <QueryClientProvider client={client}>
        <TodoList />
      </QueryClientProvider>
    );
  });
  test("render Todo List", async () => {
    // render(<TodoList />);
    const titleElem = screen.getByText(/now Loading/i);
    expect(titleElem).toBeInTheDocument();
    expect(titleElem.tagName).toBe("DIV");

    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });
    expect(screen.getByText(/test todo list/i)).toBeInTheDocument();
  });
  test("include input Element", () => {
    // render(<TodoList />);
    const inputElem = screen.getByRole("textbox");
    expect(inputElem).toBeInTheDocument();
  });

  test("input text", () => {
    // render(<TodoList />);
    const inputElem: HTMLInputElement = screen.getByRole("textbox");
    expect(inputElem).toBeInTheDocument();
    fireEvent.change(inputElem, { target: { value: "input test" } });
    expect(inputElem.value).toEqual("input test");
  });

  test("Include Add Button", () => {
    const buttonElem: HTMLButtonElement = screen.getByRole("button", {
      name: "Add Todo",
    });
    expect(buttonElem).toBeInTheDocument();
  });

  test("Add New Todo", async () => {
    const inputElem: HTMLInputElement = screen.getByRole("textbox");
    const buttonElem: HTMLButtonElement = screen.getByRole("button", {
      name: "Add Todo",
    });

    const sendAdd = async (text: string) => {
      mock
        .onPost("/todo", { title: text })
        .reply(201, { title: text, id: data.length + 1, isCompleted: false });
      data.push({ title: text, id: data.length + 1, isCompleted: false });
      await fireEvent.click(buttonElem);
      await waitFor(() => {
        const actionElem = screen.getByTitle("action", { exact: true });
        expect(actionElem).toBeInTheDocument();
        expect(actionElem.tagName).toBe("DIV");
        expect(actionElem.textContent).toBe("add");

        const listItemElem = screen.getByTitle("previous_data", {
          exact: true,
        });
        expect(listItemElem).toBeInTheDocument();
        expect(listItemElem.tagName).toBe("DIV");
        expect(listItemElem.childNodes[0].textContent).toBe(text);
      });
    };

    fireEvent.change(inputElem, { target: { value: "tester" } });
    await sendAdd(inputElem.value);

    fireEvent.change(inputElem, { target: { value: "tester2" } });
    await sendAdd(inputElem.value);
  });

  test("patch todo", async () => {
    const listBtn = await screen.getAllByTitle("completeBtn", { exact: true });
    expect(listBtn[0]).toBeInTheDocument();

    const data1 = { id: 1, title: "test todo list", isCompleted: true };

    const patch = async (
      { text, isCompleted }: { text: string; isCompleted: boolean },
      index: number
    ) => {
      mock
        .onPatch("/todo", { title: text, id: data[index].id, isCompleted })
        .reply(200, { title: text, id: data[index].id, isCompleted });
      data[index] = { title: text, id: data[index].id, isCompleted };

      fireEvent.click(listBtn[index]);

      await waitFor(async () => {
        const actionElem = screen.getByTitle("action", { exact: true });
        expect(actionElem).toBeInTheDocument();
        expect(actionElem.tagName).toBe("DIV");
        expect(actionElem.textContent).toBe("update");

        const listItemElem = screen.getByTitle("previous_data", {
          exact: true,
        });
        expect(listItemElem).toBeInTheDocument();
        expect(listItemElem.tagName).toBe("DIV");
        expect(listItemElem.childNodes[0].textContent).toBe(text);

        const listBtn = await screen.findAllByTitle("completeBtn", {
          exact: true,
        });
        expect(listBtn[index].textContent).toBe(
          isCompleted ? "완료" : "진행중"
        );
      });
    };
    await patch({ text: data1.title, isCompleted: data1.isCompleted }, 0);
  });
  test("delete todo", async () => {
    const listBtn = await screen.getAllByTitle("deleteBtn", { exact: true });
    expect(listBtn[0]).toBeInTheDocument();

    const deleteTodo = async (index: number) => {
      const beforeLength = data.length;
      const target = { ...data[index] };
      mock.onDelete(`/todo/${data[index].id}`).reply(
        200,
        data.filter((item) => item !== data[index])
      );
      data.splice(index, 1);

      fireEvent.click(listBtn[index]);

      await waitFor(async () => {
        const actionElem = screen.getByTitle("action");
        expect(actionElem).toBeInTheDocument();
        expect(actionElem.tagName).toBe("DIV");
        expect(actionElem.textContent).toBe("delete");

        const listItemElem = screen.getByTitle("previous_data");
        expect(listItemElem).toBeInTheDocument();
        expect(listItemElem.tagName).toBe("DIV");

        listItemElem.childNodes.forEach((item) => {
          expect(item.textContent).not.toBe(target.title);
        });

        expect(data.length).toBe(beforeLength - 1);
      });
    };
    await deleteTodo(1);
  });
});

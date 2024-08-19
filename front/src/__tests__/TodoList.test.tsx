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
        const listItemElem = screen.getByText(text);
        expect(listItemElem).toBeInTheDocument();
        expect(listItemElem.tagName).toBe("DIV");
      });
    };

    fireEvent.change(inputElem, { target: { value: "tester" } });
    await sendAdd(inputElem.value);

    fireEvent.change(inputElem, { target: { value: "tester2" } });
    await sendAdd(inputElem.value);
  });

  test("patch todo", async () => {
    const listeItemElems = await screen.findAllByRole("button", {
      name: "진행중" || "완료",
    });
    expect(listeItemElems[0]).toBeInTheDocument();

    const data1 = { id: 1, title: "test todo list", isCompleted: true };

    const patch = async (
      { text, isCompleted }: { text: string; isCompleted: boolean },
      index: number
    ) => {
      mock
        .onPatch("/todo", { title: text, id: data[index].id, isCompleted })
        .reply(200, { title: text, id: data[index].id, isCompleted });
      data[index] = { title: text, id: data[index].id, isCompleted };

      fireEvent.click(listeItemElems[index]);

      await waitFor(async () => {
        const listItemElem = screen.getByText(text);
        expect(listItemElem).toBeInTheDocument();
        expect(listItemElem.tagName).toBe("DIV");

        const listeItemElemsRe = await screen.findAllByRole("button", {
          name: "진행중" || "완료",
        });
        expect(listeItemElemsRe[index].textContent).toEqual(
          isCompleted ? "완료" : "진행중"
        );
      });
    };
    await patch({ text: data1.title, isCompleted: data1.isCompleted }, 0);
  });
  test("delete todo", async () => {
    const listeItemElems = await screen.findAllByRole("button", {
      name: "삭제",
    });
    expect(listeItemElems[0]).toBeInTheDocument();

    const deleteTodo = async (index: number) => {
      const beforeLength = data.length;
      const target = { ...data[index] };
      mock.onDelete(`/todo/${data[index].id}`).reply(
        200,
        data.filter((item) => item !== data[index])
      );
      data.splice(index, 1);

      fireEvent.click(listeItemElems[index]);

      await waitFor(async () => {
        const list = await screen.findAllByRole("listitem");
        for (let item of list) {
          expect(item.childNodes[0].textContent).not.toBe(target.title);
        }
        expect(data.length).toBe(beforeLength - 1);
      });
    };
    await deleteTodo(1);
  });
});

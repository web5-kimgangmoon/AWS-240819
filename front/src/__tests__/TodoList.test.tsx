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
      let response:
        | { title: string; id: number; isCompleted: boolean }
        | undefined = undefined;
      const transport = function () {
        response = { title: text, id: data.length, isCompleted: false };
        return { ...response };
      };
      mock.onPost("/todo", { title: text }).reply(201, transport());
      data.push({ title: text, id: data.length, isCompleted: false });
      await fireEvent.click(buttonElem);
      await waitFor(() => {
        expect(response).toEqual(data[data.length - 1]);
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
      name: "진행중",
    });
    expect(listeItemElems[0]).toBeInTheDocument();

    const data1 = { id: 1, title: "test todo list", isCompleted: true };

    const patch = async (
      { text, isCompleted }: { text: string; isCompleted: boolean },
      index: number
    ) => {
      let response:
        | { title: string; id: number; isCompleted: boolean }
        | undefined = undefined;
      const transport = function (data: {
        title: string;
        id: number;
        isCompleted: boolean;
      }) {
        response = data;
        return { ...response };
      };

      mock
        .onPost("/todo", { title: text, id: data[index].id, isCompleted })
        .reply(
          200,
          transport({ title: text, id: data[index].id, isCompleted })
        );
      data[index] = { title: text, id: data[index].id, isCompleted };

      await fireEvent.click(listeItemElems[index]);
      const listeItemElemsRe = await screen.findAllByRole("button", {
        name: "완료",
      });
      expect(listeItemElemsRe[index]).toBeInTheDocument();
      await waitFor(() => {
        expect(response).toEqual(data[index]);
      });
    };
    await patch({ text: data1.title, isCompleted: data1.isCompleted }, 0);
  });
  test("delete todo", async () => {
    let getData = [
      { id: 1, title: "test todo list", isCompleted: false },
      { id: 2, title: "tester", isCompleted: false },
      { id: 3, title: "tester2", isCompleted: false },
    ];
    mock.onGet("/todo").reply(200, getData);
    const listeItemElems = await screen.findAllByRole("button", {
      name: "삭제",
    });
    expect(listeItemElems[0]).toBeInTheDocument();

    const data1 = { id: 1, title: "test todo list", isCompleted: true };
    mock.onDelete("/todo/1").reply(200, data1);

    getData = [
      { id: 2, title: "tester", isCompleted: false },
      { id: 3, title: "tester2", isCompleted: false },
    ];
    mock.onGet("/todo").reply(200, getData);

    fireEvent.click(listeItemElems[0]);
    await waitFor(async () => {
      const liCount = (await screen.findAllByRole("listitem")).length;
      expect(liCount).toBe(2);
    });
  });
});

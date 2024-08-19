import { useState, useCallback, ChangeEvent, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getList,
  addList,
  patchList,
  deleteList,
  Todo as ITodo,
} from "../lib/todoAxios";

const TodoList = (): JSX.Element => {
  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["get", "/todo"],
    queryFn: getList,
  });
  const adder = useMutation({
    mutationKey: ["post", "/todo"],
    mutationFn: async (text: string) => {
      return await addList(text);
    },
    onSuccess: () => {
      setText("");
      refetch();
    },
    onError: () => {
      console.log("에러발생");
    },
  });
  const update = useMutation({
    mutationKey: ["patch", "/todo"],
    mutationFn: async (todo: ITodo) => {
      return await patchList(todo);
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.log("에러발생");
    },
  });
  const deleteTodo = useMutation({
    mutationKey: ["deleteTodo", "/todo"],
    mutationFn: async (id: number) => {
      return await deleteList(id);
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.log("에러발생");
    },
  });
  const [text, setText] = useState<string>("");

  const onChagne = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setText(value);
    },
    []
  );
  const addTodo = useCallback(
    async () => await adder.mutate(text),

    [text]
  );
  if (isLoading) return <div>now Loading</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <ul>
          {data?.map((item: ITodo, idx: number) => (
            <li key={item.id}>
              <div>{item.title}</div>
              <div>
                <button
                  onClick={async () =>
                    await update.mutate({
                      ...item,
                      isCompleted: !item.isCompleted,
                    })
                  }
                >
                  {item.isCompleted ? "완료" : "진행중"}
                </button>
              </div>
              <div>
                <button onClick={async () => await deleteTodo.mutate(item.id)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input onChange={onChagne} />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default TodoList;

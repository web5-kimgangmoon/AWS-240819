import { useState, useCallback, ChangeEvent, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getList,
  addList,
  patchList,
  deleteList,
  Todo as ITodo,
  Todo,
} from "../../lib/todoAxios";

const TodoList = (): JSX.Element => {
  const client = useQueryClient();
  const [text, setText] = useState<string>("");
  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["get", "/todo"],
    queryFn: getList,
  });
  const adder = useMutation({
    mutationKey: ["post", "/todo"],
    mutationFn: async () => {
      return { data: [await addList(text)], getTime: Date.now() };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["get", "/todo"] });
      setText("");
    },
    onError: () => {
      console.log("에러발생");
    },
  });
  const update = useMutation({
    mutationKey: ["patch", "/todo"],
    mutationFn: async (todo: ITodo) => {
      return { data: [await patchList(todo)], getTime: Date.now() };
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
      return { data: await deleteList(id), getTime: Date.now() };
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.log("에러발생");
    },
  });
  const previousAction: { action: string; data: Todo[]; getTime: number } =
    useMemo(() => {
      let temp: { action: string; data: Todo[]; getTime: number } = {
        action: "none",
        data: [],
        getTime: 0,
      };
      if (adder?.data?.data && temp.getTime < adder.data.getTime) {
        temp = {
          action: "add",
          data: adder.data.data,
          getTime: adder.data.getTime,
        };
      }
      if (deleteTodo?.data?.data && temp.getTime < deleteTodo.data.getTime) {
        temp = {
          action: "delete",
          data: deleteTodo.data.data,
          getTime: deleteTodo.data.getTime,
        };
      }
      if (update?.data?.data && temp.getTime < update.data.getTime) {
        temp = {
          action: "update",
          data: update.data.data,
          getTime: update.data.getTime,
        };
      }
      return temp;
    }, [adder.data, deleteTodo.data, update.data]);

  const onChagne = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setText(value);
    },
    []
  );
  const add = useCallback(async () => {
    await adder.mutate();
    setText("");
  }, [setText, adder, text]);
  if (isLoading || adder.isPending || deleteTodo.isPending || update.isPending)
    return <div>now Loading</div>;
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
        <button onClick={add}>Add Todo</button>
      </div>
      {}
      <div>
        <div>지난 작업</div>
        <div id="previousAction">{previousAction["action"]}</div>
        <div>받은 데이터</div>
        <div id="actionResData">
          {previousAction.data.length !== 0
            ? previousAction["data"].map((item) => (
                <span style={{ display: "block" }}>{item.title}</span>
              ))
            : "없음"}
        </div>
      </div>
    </div>
  );
};

export default TodoList;

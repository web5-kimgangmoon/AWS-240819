import { useState, useCallback, ChangeEvent, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Todo as ITodo } from "../lib/todoAxios";
import useGetList from "../customQuery/useGetList";
import useAdd from "../customMutation/useAdd";
import useDelete from "../customMutation/useDelete";
import useUpdate from "../customMutation/useUpdate";

const TodoList = (): JSX.Element => {
  const client = useQueryClient();
  const [text, setText] = useState<string>("");
  const { data, isError, isLoading, error } = useGetList();
  const adder = useAdd(client, setText);
  const update = useUpdate(client);
  const deleteTodo = useDelete(client);
  const previousAction: { action: string; data: ITodo[]; getTime: number } =
    useMemo(() => {
      let temp: { action: string; data: ITodo[]; getTime: number } = {
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
    await adder.mutate(text);
  }, [adder, text]);

  if (isLoading || adder.isPending || deleteTodo.isPending || update.isPending)
    return <div>now Loading</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <ul
          style={{
            display: "table",
            padding: "0",
            margin: "0",
          }}
        >
          {data?.map((item: ITodo, idx: number) => (
            <li key={item.id} style={{ display: "table-row" }}>
              <div style={{ display: "table-cell", columnCount: "2" }}>
                {item.title}
              </div>
              <div style={{ display: "table-cell", padding: "1rem" }}>
                <button
                  title={"completeBtn"}
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
              <div style={{ display: "table-cell" }}>
                <button
                  title={"deleteBtn"}
                  onClick={async () => await deleteTodo.mutate(item.id)}
                >
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
      <div>
        <div>지난 작업</div>
        <div title={"action"}>{previousAction["action"]}</div>
        <div>받은 데이터</div>
        <div title="previous_data">
          {previousAction.data.length !== 0
            ? previousAction["data"].map((item) => (
                <span key={item.id} style={{ display: "block" }}>
                  {item.title}
                </span>
              ))
            : "없음"}
        </div>
      </div>
    </div>
  );
};

export default TodoList;

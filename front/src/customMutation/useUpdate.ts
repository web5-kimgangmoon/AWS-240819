import { QueryClient, useMutation } from "@tanstack/react-query";
import { patchList } from "../lib/todoAxios";
import { Todo as ITodo } from "../lib/todoAxios";

const useUpdate = (client: QueryClient) =>
  useMutation({
    mutationKey: ["patch", "/todo"],
    mutationFn: async (todo: ITodo) => {
      return { data: [await patchList(todo)], getTime: Date.now() };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["get", "/todo"] });
    },
    onError: () => {
      console.log("에러발생");
    },
  });

export default useUpdate;

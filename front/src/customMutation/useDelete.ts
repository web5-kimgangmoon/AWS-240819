import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteList } from "../lib/todoAxios";

const useDelete = (client: QueryClient) =>
  useMutation({
    mutationKey: ["deleteTodo", "/todo"],
    mutationFn: async (id: number) => {
      return { data: await deleteList(id), getTime: Date.now() };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["get", "/todo"] });
    },
    onError: () => {
      console.log("에러발생");
    },
  });

export default useDelete;

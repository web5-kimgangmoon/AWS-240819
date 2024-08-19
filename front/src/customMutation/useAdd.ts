import { QueryClient, useMutation } from "@tanstack/react-query";
import { addList } from "../lib/todoAxios";

const useAdd = (client: QueryClient, setText: (str: string) => void) => {
  return useMutation({
    mutationKey: ["post", "/todo"],
    mutationFn: async (text: string) => {
      return { data: [await addList(text)], getTime: Date.now() };
    },
    onSuccess: () => {
      setText("");
      client.invalidateQueries({ queryKey: ["get", "/todo"] });
    },
    onError: () => {
      console.log("에러발생");
    },
  });
};

export default useAdd;

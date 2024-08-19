import { useQuery } from "@tanstack/react-query";
import { getList } from "../lib/todoAxios";

const useGetList = () => {
  return useQuery({
    queryKey: ["get", "/todo"],
    queryFn: getList,
  });
};

export default useGetList;

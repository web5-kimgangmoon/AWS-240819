import instance from "./axios";

export interface Todo {
  id: number;
  title?: string;
  isCompleted?: boolean;
}

export const getList = async (): Promise<Todo[]> => {
  try {
    const response = await instance.get("/todo");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Get List");
  }
};

export const addList = async (title: string): Promise<Todo> => {
  try {
    const response = await instance.post("/todo", { title });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Post todo");
  }
};

export const patchList = async (todo: Todo): Promise<Todo> => {
  try {
    const response = await instance.patch("/todo", todo);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Patch todo");
  }
};

export const deleteList = async (id: number): Promise<Todo[]> => {
  try {
    const response = await instance.delete(`/todo/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Patch todo");
  }
};

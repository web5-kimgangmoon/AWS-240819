interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

const todoList: Todo[] = [];

let todoCnt = 1;

export const add = (title: string) => {
  if (title?.length) {
    todoList.push({
      id: todoCnt++,
      title,
      isCompleted: false,
    });
    return todoList[todoCnt - 2];
  } else {
    throw new Error("plz input title");
  }
};

export const show = () => {
  //   if (todoList) {
  return todoList;
  //   } else {
  // throw new Error("no exists");
  //   }
};

export const deleteTodo = (targetId: number) => {
  // let result = todoList.filter((item) =>item.id!=targetId? true :false);
  let target;
  let targetIdx: number = -1;
  if (
    todoList.length > 0 &&
    (target = todoList.find((item, index) => {
      if (item.id == targetId) {
        targetIdx = index;
        return true;
      }
      return false;
    }))
  ) {
    todoList.splice(targetIdx as number, 1);
    return target;
  } else {
    throw new Error("no exists");
  }
};

export const updateTodo = (targetId: number) => {
  // let result = todoList.filter((item) =>item.id!=targetId? true :false);
  let target;
  let targetIdx = -1;
  if (
    todoList.length > 0 &&
    (target = todoList.find((item, index) => {
      if (item.id == targetId) {
        targetIdx = index;
        return true;
      }
      return false;
    }))
  ) {
    todoList[targetIdx].isCompleted = !todoList[targetIdx].isCompleted;
    return target;
  } else {
    throw new Error("no exists");
  }
};

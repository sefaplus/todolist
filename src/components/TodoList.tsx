import { useEffect } from "react";
import TodoItem from "./TodoItem";
import React from "react";
import { Filter, Task } from "./TodoListApp";
export default function TaskList({
  tasks,
  filter,
  onTodoChange,
  onTodoDelete,
}: {
  tasks: Array<Task>;
  filter: Filter;
  onTodoChange: Function;
  onTodoDelete: Function;
}) {
  useEffect(() => {}, [filter]);
  return (
    <ul>
      {tasks
        .filter(
          (todo: Task) =>
            todo != null && // incase todo val is undefined
            (filter === Filter.ALL ||
              (todo.status
                ? filter === Filter.COMPLETED
                : filter === Filter.ACTIVE))
        )
        .map((todo: Task) => (
          <TodoItem
            value={todo}
            onTodoChange={onTodoChange(todo._id)}
            onTodoDelete={onTodoDelete(todo._id)}
            key={todo._id}
          />
        ))}
    </ul>
  );
}

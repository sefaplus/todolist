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
    <>
      {tasks
        .filter((todo: Task) =>
          filter === Filter.ALL || (todo.status
            ? filter === Filter.COMPLETED
            : filter === Filter.ACTIVE)
        )
        .map((todo: any) => {
          return (
            <TodoItem
              value={todo}
              onTodoChange={onTodoChange(todo.id)}
              onTodoDelete={onTodoDelete(todo.id)}
              key={todo.id}
            />
          );
        })}
    </>
  );
}

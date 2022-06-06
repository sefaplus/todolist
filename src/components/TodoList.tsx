import { useEffect } from "react";
import TodoItem from "./TodoItem";
import React from "react";
import { Filter } from "./TodoListApp";
export default function TaskList({
  tasks,
  filter,
  onTodoChange,
  onTodoDelete,
}: {
  tasks: any;
  filter: any;
  onTodoChange: any;
  onTodoDelete: any;
}) {
  useEffect(() => {}, [filter]);

  type keyPairArray = {
    0: string;
    1: object;
  }
  let tasksArray = Object.entries(tasks) as Array<keyPairArray>;
  
  tasksArray = tasksArray.filter((element: any) => {
    return (
      filter === Filter.ALL ||
      (element[1].status
        ? filter === Filter.COMPLETED
        : filter === Filter.ACTIVE)
    );
  });
  return (
    <>
      {}
      {tasksArray.map(({ 0: id, 1: value }) => {
        return (
          <TodoItem
            id={id}
            value={value}
            onTodoChange={onTodoChange(id)}
            onTodoDelete={onTodoDelete(id)}
            key={id}
          />
        );
      })}
    </>
  );
}

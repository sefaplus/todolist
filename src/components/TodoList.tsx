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
  let tasksArray = Object.entries(tasks);

  tasksArray = tasksArray.filter((element: any) => {
    return (
      filter === Filter.ALL ||
      (element[1].status
        ? filter === Filter.COMPLETED
        : filter === Filter.ACTIVE)
    );
  });
  console.log(filter, tasksArray);
  //console.log(tasks, tasksArray[0][1]);
  return (
    <>
      {}
      {tasksArray.map(({0: id, 1: value}) => {
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

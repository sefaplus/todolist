import { useEffect } from "react";
import TodoItem from "./TodoItem";
import React from 'react'; 

export default function TaskList({
  tasks,
  filter,
  onTodoChange,
  onTodoDelete,
} : { tasks: any,
  filter: any,
  onTodoChange: any,
  onTodoDelete: any,}) {
  useEffect(() => {}, [filter]);

  return <>
    {Object.keys(tasks).map((todoDataId) => (
      <TodoItem
        id={todoDataId}
        value={tasks[todoDataId]}
        filter={filter}
        onTodoChange={onTodoChange(todoDataId)}
        onTodoDelete={onTodoDelete(todoDataId)}
        key={todoDataId}
      />
    ))}
  </>
}

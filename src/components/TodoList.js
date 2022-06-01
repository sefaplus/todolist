import { useEffect } from "react";
import TodoItem from "./TodoItem";

export default function TaskList({
  tasks,
  filter,
  onTodoChange,
  onTodoDelete,
}) {
  useEffect(() => {}, [filter]);

  return Object.keys(tasks).map((todoDataId) => (
    <TodoItem
      id={todoDataId}
      value={tasks[todoDataId]}
      filter={filter}
      onTodoChange={onTodoChange(todoDataId)}
      onTodoDelete={onTodoDelete(todoDataId)}
    />
  ));
}

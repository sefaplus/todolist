import { useEffect } from "react";
import TodoItem from "./TodoItem";
import { Filter } from "./TodoListApp";

export default function TaskList({
  tasks,
  filter,
  onTodoChange,
  onTodoDelete,
}) {
  useEffect(() => {}, [filter]);
  return tasks
    .filter(({ status }) =>
      (filter === Filter.ALL) || (status
        ? filter === Filter.COMPLETED
        : filter === Filter.ACTIVE)
    )
    .map((todoData) => (
      <TodoItem
        key={todoData.id}
        value={todoData}
        onTodoChange={onTodoChange(todoData.id)}
        onTodoDelete={onTodoDelete(todoData.id)}
      />
    ));
}

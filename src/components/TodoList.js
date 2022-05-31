import { useEffect } from "react";
import TodoItem from "./TodoItem";

export default function TaskList({ tasks, filter, onTodoChange, onTodoDelete }) {
  useEffect(()=> {}, [filter]);
  return tasks.map((todoData) => (
    <TodoItem key={todoData.id} value={todoData} filter={filter} onTodoChange={onTodoChange(todoData.id)} onTodoDelete={onTodoDelete(todoData.id)} />
  ));
}

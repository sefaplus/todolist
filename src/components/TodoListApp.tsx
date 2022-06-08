import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import React from "react";
import FilterButton from "./FilterButton";
import Api from "../js/api";

const api = new Api();
export const enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type Task = { id: number; status: boolean; task: string };

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos")!);
  let [localTasks, setLocalTasks] = useState([] as Array<Task>);
  let [filter, setFilter] = useState(Filter.ALL);

  useEffect(() => {
    console.log("Reload");
    api.getData(setLocalTasks, localTasks);
  }, []);

  useEffect(() => {
    api.setData(localTasks);
  }, [localTasks]);

  const handleTodoAdd = (todoName: string) => {
    let newId = Date.now()
    setLocalTasks((prevTasks: Array<Task>) => {
      let newTask: Task = { id: newId, task: todoName, status: false };
      let newTasks: Array<Task> = [...prevTasks, newTask];
      return newTasks;
    });
    api.addChangeId(newId);
  };
  const handleToggleAllTasks = () =>
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.map((todo) => {
        if (!todo.status) api.addChangeId(todo.id);
        return { ...todo, status: true };
      })
    );

  const handleTodoChange = (id: number) => (updatedTodo: Task) => {
    setLocalTasks((prevTasks: Array<Task>) => {
      return prevTasks.map((todo) => {
        return todo.id === id ? { ...todo, ...updatedTodo } : todo;
      });
    });
    api.addChangeId(id);
  };

  const handleTodoDelete = (id: number) => () => {
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => todo.id !== id)
    );
    api.addDeleteId(id);
  };

  const handleDeleteCompleted = () => {
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => {
        todo.status ? api.addDeleteId(todo.id) : null;
        return !todo.status;
      })
    );
  };

  return (
    <>
      <TodoNameInput
        onClick={handleTodoAdd}
        onClickAllTask={handleToggleAllTasks}
      />
      <ul>
        <TaskList
          tasks={localTasks}
          filter={filter}
          onTodoChange={handleTodoChange}
          onTodoDelete={handleTodoDelete}
        />
      </ul>
      <footer>
        <div className="todo-list-controls">
          <p> Current tasks: {localTasks.length} </p>
          <FilterButton
            text="All"
            filterOption={Filter.ALL}
            setFilter={setFilter}
            selected={filter === Filter.ALL}
          />
          <FilterButton
            text="Active"
            filterOption={Filter.ACTIVE}
            setFilter={setFilter}
            selected={filter === Filter.ACTIVE}
          />
          <FilterButton
            text="Complete"
            filterOption={Filter.COMPLETED}
            selected={filter === Filter.COMPLETED}
            setFilter={setFilter}
          />
          <button onClick={handleDeleteCompleted}> Remove completed </button>
          <button onClick={api.saveFile}> Save to File </button>
        </div>
      </footer>
    </>
  );
}

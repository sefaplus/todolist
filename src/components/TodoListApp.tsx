import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import React from "react";

export enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos")!);
  let [localTasks, setLocalTasks] = useState(
    parsedTodos == undefined ? {} : parsedTodos
  );
  interface taskType {
    [id: string]: { id: number; status: boolean; task: string };
  }

  let [filter, setFilter] = useState(Filter.ALL);

  useEffect(() => {
    return localStorage.setItem("todos", JSON.stringify(localTasks));
  }, [localTasks]);

  const handleTodoAdd = (todoName: string) => {
    setLocalTasks((prevTasks: taskType) => {
      let obj: any = {
        ...prevTasks,
      };
      obj[Date.now()] = { status: false, task: todoName, id: Date.now() };
      return obj;
      // It woudnt let me to just return {...prevTasks, Date().now : { status: false, task: todoName}}
      // Theres probably an easier way.
    });
  };
  const handleToggleAllTasks = () => {
    setLocalTasks((prevTasks: taskType) =>
      Object.keys(prevTasks).map((todoId: string) => {
        let obj: object = { ...prevTasks[todoId], status: true };
        return prevTasks[todoId].status === false ? obj : prevTasks[todoId];
      })
    );
  };

  const handleTodoChange = (id: string) => (updatedTodo: object) =>
    setLocalTasks((prevTasks: taskType) => {
      let obj: taskType = { ...prevTasks };
      Object.keys(prevTasks).forEach((todoId: string) =>
        todoId == id
          ? (obj[id] = { ...prevTasks[todoId], ...updatedTodo })
          : null
      );
      return obj;
    });
  const handleTodoDelete = (id: string) => (idToDelete: string) => {
    setLocalTasks((prevTasks: object) => {
      let obj: taskType = { ...prevTasks };
      delete obj[id];
      return obj;
    });
  };
  const handleDeleteCompleted = () => {
    setLocalTasks((prevTasks: taskType) => {
      let obj: taskType = { ...prevTasks };
      Object.keys(prevTasks).forEach((todoId: string) =>
        obj[todoId].status ? delete obj[todoId] : null
      );
      return obj;
      // Still have to use temporary obj to return data. This time, returning modified prevTasks doesnt trigger useEffect()
      // If forEach fn would've been like this:
      //     Object.keys(prevTasks).forEach((todoId) =>
      //     prevTasks[todoId].status ? delete prevTasks[todoId] : null
      //   );
      //   return prevTasks;
      // It wouldn't've worked. There's probably an easier way to do this.
    });
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
          <p> Current tasks: {Object.keys(localTasks).length}</p>
          <button onClick={() => setFilter(Filter.ALL)}> ALL </button>
          <button onClick={() => setFilter(Filter.ACTIVE)}> Active </button>
          <button onClick={() => setFilter(Filter.COMPLETED)}>Completed</button>
          <button onClick={handleDeleteCompleted}> Remove completed </button>
        </div>
      </footer>
    </>
  );
}

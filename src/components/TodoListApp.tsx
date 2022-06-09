import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import React from "react";
import FilterButton from "./FilterButton";
import API from "../js/ApiMongo";

const MongoAPI = new API();
export const enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type Task = { _id: number; status: boolean; task: string };

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos")!);
  let [localTasks, setLocalTasks] = useState([] as Array<Task>);
  let [filter, setFilter] = useState(Filter.ALL);

  useEffect(() => {
    console.log("Reload");
    MongoAPI.fetchAndSet(setLocalTasks, "http://localhost:5000/api");
  }, []);

  useEffect(() => {
    MongoAPI.setApiData(localTasks);
  }, [localTasks]);

  const handleTodoAdd = (todoName: string) => {
    let newId = Date.now();
    setLocalTasks((prevTasks: Array<Task>) => {
      let newTask: Task = { _id: newId, task: todoName, status: false };
      let newTasks: Array<Task> = [...prevTasks, newTask];
      return newTasks;
    });
    MongoAPI.addToUpdateList(newId);
  };
  const handleToggleAllTasks = () =>
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.map((todo) => {
        MongoAPI.addToUpdateList(todo._id);
        return { ...todo, status: true };
      })
    );

  const handleTodoChange = (id: number) => (updatedTodo: Task) => {
    setLocalTasks((prevTasks: Array<Task>) => {
      return prevTasks.map((todo) => {
        return todo._id === id ? { ...todo, ...updatedTodo } : todo;
      });
    });
    MongoAPI.addToUpdateList(id);
  };

  const handleTodoDelete = (id: number) => () => {
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => todo._id !== id)
    );
    MongoAPI.addToDeleteList(id);
  };

  const handleDeleteCompleted = () => {
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => {
        todo.status ? MongoAPI.addToDeleteList(todo._id) : null;
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
          <button onClick={() => MongoAPI.saveToCloud(setLocalTasks)}>
            Save to File
          </button>
        </div>
      </footer>
    </>
  );
}

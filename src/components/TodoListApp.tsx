import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import React from "react";
import FilterButton from "./FilterButton";
import API from "../js/ApiMongo";
import UploadDialog from "./UploadTodoList";
import { Link, useNavigate } from "react-router-dom";
import ApiLogin from "../js/ApiLogin";

const MongoAPI = new API();
export const enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type Task = { _id: string; status: boolean; task: string };

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos")!);
  const navigator = useNavigate();
  let [localTasks, setLocalTasks] = useState([] as Array<Task>);
  let [filter, setFilter] = useState(Filter.ALL);
  let [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    console.log("Reload");
    ApiLogin.checkLogin(navigator);
    MongoAPI.fetchAndSet(setLocalTasks, "http://localhost:5000/api", navigator);
  }, []);

  useEffect(() => {
    MongoAPI.setApiData(localTasks);
  }, [localTasks]);

  const handleTodoAdd = (todoName: string) => {
    let newId = JSON.stringify(Date.now());

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

  const handleTodoChange = (id: string) => (updatedTodo: Task) => {
    setLocalTasks((prevTasks: Array<Task>) => {
      return prevTasks.map((todo) => {
        return todo._id === id ? { ...todo, ...updatedTodo } : todo;
      });
    });
    MongoAPI.addToUpdateList(id);
  };

  const handleTodoDelete = (id: string) => () => {
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
  const handleDialogShow = () => {
    setDialogVisible(true);
  };
  return (
    <>
      <UploadDialog
        visible={dialogVisible}
        setDialogVisible={setDialogVisible}
        setOwnTaskList={MongoAPI.setOwnTaskList}
        setLocalTasks={setLocalTasks}
      />
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
          <div>
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
            <button className="filter-button" onClick={handleDeleteCompleted}>
              Remove completed
            </button>
          </div>
          <div>
            <button
              className="filter-button"
              onClick={() =>
                (location.href = "http://localhost:5000/api/download")
              }
            >
              Download this list
            </button>
            <button className="filter-button" onClick={handleDialogShow}>
              Upload todo list from File
            </button>
            <button
              className="filter-button"
              onClick={() => MongoAPI.saveToCloud(setLocalTasks)}
            >
              SYNC
            </button>
            <Link to="/"> LOGIN </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

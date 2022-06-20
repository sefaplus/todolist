import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import React from "react";
import FilterButton from "./FilterButton";
import ApiMongo from "../js/ApiMongo";
import ApiLogin from "../js/ApiLogin";
import UploadDialog from "./UploadDialog";
import { useNavigate } from "react-router-dom";
import WarningDialog from "./WarningDialog";
import CloudSyncBtn from "./CloudSyncBtn";

export const enum Filter {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type Task = {
  _id: string;
  status: boolean;
  task: string;
  position: number;
};

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos")!);
  const navigator = useNavigate();
  let [localTasks, setLocalTasks] = useState([] as Array<Task>);
  let [filter, setFilter] = useState(Filter.ALL);
  let [dialogVisible, setDialogVisible] = useState(false);

  let [warningVisible, setWarningVisible] = useState(false);
  let [errorText, setErrorText] = useState("");
  useEffect(() => {
    console.log("Reload");

    ApiMongo.setWarning(setErrorText, setWarningVisible);

    ApiMongo.fetchAndSet(setLocalTasks, "http://localhost:5000/api", navigator);
  }, []);

  useEffect(() => {
    ApiMongo.setApiData(localTasks);
  }, [localTasks]);

  const handleTodoAdd = (todoName: string) => {
    let newId = JSON.stringify(Date.now());

    setLocalTasks((prevTasks: Array<Task>) => {
      const position = prevTasks.length + 1;

      let newTask: Task = {
        _id: newId,
        task: todoName,
        status: false,
        position: position,
      };
      let newTasks: Array<Task> = [...prevTasks, newTask];

      return newTasks;
    });

    ApiMongo.addToUpdateList(newId);
  };

  const handleToggleAllTasks = () =>
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.map((todo) => {
        ApiMongo.addToUpdateList(todo._id);
        return { ...todo, status: true };
      })
    );

  const handleTodoChange = (id: string) => (updatedTodo: Task) => {
    setLocalTasks((prevTasks: Array<Task>) => {
      return prevTasks.map((todo) =>
        todo._id === id ? { ...todo, ...updatedTodo } : todo
      );
    });
    ApiMongo.addToUpdateList(id);
  };

  const handleTodoDelete = (id: string) => () => {
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => todo._id !== id)
    );
    ApiMongo.addToDeleteList(id);
  };

  const handleDeleteCompleted = () =>
    setLocalTasks((prevTasks: Array<Task>) =>
      prevTasks.filter((todo) => {
        todo.status ? ApiMongo.addToDeleteList(todo._id) : null;

        return !todo.status;
      })
    );

  const handleDialogShow = () => setDialogVisible(true);

  return (
    <>
      <WarningDialog
        errorText={errorText}
        warningVisible={warningVisible}
        setWarningVisible={setWarningVisible}
      />
      <UploadDialog
        visible={dialogVisible}
        setDialogVisible={setDialogVisible}
        setOwnTaskList={ApiMongo.setOwnTaskList}
        setLocalTasks={setLocalTasks}
      />
      <TodoNameInput
        onClick={handleTodoAdd}
        onClickAllTask={handleToggleAllTasks}
      />
      <TaskList
        tasks={localTasks}
        filter={filter}
        onTodoChange={handleTodoChange}
        onTodoDelete={handleTodoDelete}
      />
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
          <div className="controls-server">
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
            <CloudSyncBtn
              setLocalTasks={setLocalTasks}
              ApiSaveCloudFn={ApiMongo.saveToCloud}
            />
          </div>
          <p>
            <button onClick={() => ApiLogin.logout(navigator)}> Logout </button>
          </p>
        </div>
      </footer>
    </>
  );
}

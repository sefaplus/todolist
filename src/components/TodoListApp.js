import { useEffect, useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";

export default function TodoListApp() {
  const parsedTodos = JSON.parse(localStorage.getItem("todos"));
  let [localTasks, setLocalTasks] = useState(
    parsedTodos == undefined ? {} : parsedTodos
  );
  let [filter, setFilter] = useState(0);
  const todos = JSON.parse(localStorage.getItem("todos"));

  useEffect(() => {
    return localStorage.setItem("todos", JSON.stringify(localTasks));
  }, [localTasks]);

  const handleTodoAdd = (todoName) => {
    setLocalTasks((prevTasks) => {
      let obj = {
        ...prevTasks,
      };
      obj[Date.now()] = { status: false, task: todoName, id: Date.now() };
      return obj;
      // It woudnt let me to just return {...prevTasks, Date().now : { status: false, task: todoName}}
      // Theres probably an easier way.
    });
  };
  const handleToggleAllTasks = () => {
    setLocalTasks((prevTasks) =>
      Object.keys(prevTasks).map((todoId) => {
        let obj = { ...prevTasks[todoId], status: true };
        return prevTasks[todoId].status === false ? obj : prevTasks[todoId];
      })
    );
  };

  const handleTodoChange = (id) => (updatedTodo) =>
    setLocalTasks((prevTasks) => {
      let obj = { ...prevTasks };
      Object.keys(prevTasks).forEach((todoId) =>
        todoId == id
          ? (obj[id] = { ...prevTasks[todoId], ...updatedTodo })
          : null
      );
      return obj;
    });
  const handleTodoDelete = (id) => (idToDelete) => {
    setLocalTasks((prevTasks) => {
      let obj = { ...prevTasks };
      delete obj[id];
      return obj;
    });
  };
  const handleDeleteCompleted = () => {
    setLocalTasks((prevTasks) => {
      let obj = { ...prevTasks };
      Object.keys(prevTasks).forEach((todoId) =>
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
      />{" "}
      <ul>
        {" "}
        <TaskList
          tasks={localTasks}
          filter={filter}
          onTodoChange={handleTodoChange}
          onTodoDelete={handleTodoDelete}
        />{" "}
      </ul>{" "}
      <footer>
        <div className="todo-list-controls">
          <button onClick={() => setFilter(0)}> ALL </button>{" "}
          <button onClick={() => setFilter(1)}> Active </button>{" "}
          <button onClick={() => setFilter(2)}> Completed </button>{" "}
          <button onClick={handleDeleteCompleted}> Remove completed </button>{" "}
        </div>{" "}
      </footer>{" "}
    </>
  );
}

import { useState } from "react";
import TaskList from "./TodoList";
import TodoNameInput from "./TodoNameInput";
import { setLocalStorageObject, localStorageToArray, rmLocalStorageObject} from '../js/localStorageObjectFunctionality.js';

export default function TodoListApp() {
  let [localTasks, setLocalTasks] = useState(localStorageToArray(window.localStorage));
  let [filter, setFilter] = useState(0);

  const handleTodoAdd = (todoName) => {
    setLocalTasks((prevLocalTasks) => {
      let newId = Date.now();
      let newTask = { task: todoName, status: false, id: newId};
      let object = [...prevLocalTasks, newTask ];
      setLocalStorageObject(newId, newTask)
      return object});
  };

  const handleToggleAllTasks = () => {
    setLocalTasks((prevTasks) =>
       prevTasks.map((todo) => {
          let object = {...todo, status: true};
          setLocalStorageObject(todo.id, object)
          return todo.status === false ? object : todo
       }
       ));
  };

  const handleTodoChange = (id) => (updatedTodo) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((todo) =>{
        if(todo.id === id) { setLocalStorageObject(id, {...todo,  ...updatedTodo, id: id }) };
        return todo.id === id ? { ...todo, ...updatedTodo } : todo;
      })
    );
  };
  const handleTodoDelete = (id) => (idToDelete) => {
    const thatId = (el) => el.id !== id;
    setLocalTasks((prevTasks) => {
      window.localStorage.removeItem(id);
      return prevTasks.filter(thatId);
    });
    
  };
  const handleDeleteCompleted = () => {
    setLocalTasks((prevTasks) => { 
      const statusTrue = (el) => el.status === false;
      prevTasks.forEach((todo) => {
        if(todo.status === true) { rmLocalStorageObject(todo.id) }
      });
      return prevTasks.filter(statusTrue);
    });
  };
  
  return (
    <>
      <TodoNameInput onClick={handleTodoAdd} onClickAllTask={handleToggleAllTasks}/>
      <ul>
        <TaskList tasks={localTasks} filter={filter} onTodoChange={handleTodoChange} onTodoDelete={handleTodoDelete}/>
      </ul>
      <footer>
        <p> Tasks amount: {localTasks.length} </p>
        <div className="todo-list-controls">
          <button onClick={() => setFilter(0)}> ALL </button>
          <button onClick={() => setFilter(1)}> Active </button>
          <button onClick={() => setFilter(2)}> Completed </button>
          <button onClick={handleDeleteCompleted}> Remove completed </button>
        </div>
      </footer>
    </>
  );
}

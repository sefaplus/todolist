import { useEffect } from "react";

export default function TodoItem({ value, onTodoChange, onTodoDelete }) {
  // useEffect ( ()=> {
  //   return document.querySelector('input[type=text]').removeEventListener('keypress', handleTaskTextChange);
  // });
  const { task, status, id } = value;

  function handleTaskStatus(e) {
    onTodoChange({ status: e.target.checked });
  }

  function handleTodoChange(e) {
    onTodoChange({ task: e.target.value });
  }
  function handleTodoDelete(e) {
    onTodoDelete({ id: e.target.value });
  }
  let doubleClck;
  function handleSingleClick(e) {
    if (e.detail == 1) {
      setTimeout(() => {
        if (!doubleClck) {
          let chkbx = document.querySelector(`input[id='${id}']`);
          onTodoChange({ status: !chkbx.checked });
        }
        doubleClck = false;
      }, 200);
    } else if (e.detail == 2) {
      doubleClck = true;
      e.target.readOnly = false;
      e.target.addEventListener("keypress", handleTaskTextChange);
      e.target.addEventListener("onblur", handleTaskTextChange);
    }
  }
  function handleTaskTextChange(e) {
    console.log('out');
    if (e.type === "keypress" && e.key == "Enter") {
      e.target.readOnly = true;
      e.target.removeEventListener("keypress", handleTaskTextChange);
    } else if(e.type==='onblur') {
      e.target.readOnly = true;
      e.target.removeEventListener("onblur", handleTaskTextChange);
    }
  }

  return (
    <li key={id} onClick={handleSingleClick}>
      <div className="round">
        <input
          type="checkbox"
          className="checkmark"
          value={status}
          checked={status}
          onChange={handleTaskStatus}
          id={id}
        />
        <label htmlFor={id}></label>
      </div>
      <input
        type="text"
        onChange={handleTodoChange}
        className="todolist-task"
        value={task}
        readOnly={true}
      />
      <button className="button-rounded" value={id} onClick={handleTodoDelete}>
        X
      </button>
    </li>
  );
}

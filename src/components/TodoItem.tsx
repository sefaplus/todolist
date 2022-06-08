import React, { BaseSyntheticEvent, useEffect } from "react";
import { Task } from "./TodoListApp";
export default function TodoItem({
  value,
  onTodoChange,
  onTodoDelete,
}: {
  value: Task;
  onTodoChange: Function;
  onTodoDelete: Function;
}) {
  const { id, task, status } = value;
  useEffect(() => {
    let textarea = document.getElementById(`${id}text`) as HTMLTextAreaElement;
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);
  function handleTaskStatus(e: BaseSyntheticEvent) {
    onTodoChange({
      status: (e.target as HTMLInputElement).checked,
    });
  }

  function handleTodoChange(e: BaseSyntheticEvent) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onTodoChange({
      task: (e.target as HTMLInputElement).value,
    });
  }

  function handleTodoDelete(e: React.MouseEvent) {
    onTodoDelete({ id: (e.target as HTMLInputElement).value });
  }

  function handleDblClick(e: React.MouseEvent) {
    let target = e.target as HTMLInputElement;
    target.readOnly = false;
  }

  function handleKeypress(e: React.KeyboardEvent) {
    if (e.key == "Enter") {
      let target = e.target as HTMLInputElement;
      target.readOnly = true;
    }
  }
  return (
    <li>
      <div className="round">
        <input
          type="checkbox"
          className="checkmark"
          value={`${status}`}
          checked={status}
          onChange={handleTaskStatus}
          id={`${id}`}
        />
        <label htmlFor={`${id}`}></label>
      </div>
      <textarea
        onChange={handleTodoChange}
        className="todolist-task"
        value={task}
        readOnly={true}
        onBlur={(e) => (e.target.readOnly = true)}
        onKeyDown={handleKeypress}
        onDoubleClick={handleDblClick}
        id={`${id}text`}
      />
      <button className="button-rounded" value={id} onClick={handleTodoDelete}>
        X
      </button>
    </li>
  );
}

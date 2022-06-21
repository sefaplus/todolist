import React, { BaseSyntheticEvent, useEffect } from "react";
import { Task } from "./TodoListApp";
let counter = 0;
export default function TodoItem({
  value,
  onTodoChange,
  onTodoDelete,
}: {
  value: Task;
  onTodoChange: Function;
  onTodoDelete: Function;
}) {
  const { _id, task, status } = value;

  useEffect(() => {
    // Setting textarea height of its scroll height (makes multiline)
    const textarea = document.getElementById(
      `textarea-${_id}`
    ) as HTMLTextAreaElement;

    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  function handleTaskStatus(e: React.ChangeEvent) {
    onTodoChange({
      status: (e.target as HTMLInputElement).checked,
    });
  }

  function handleTodoChange(e: React.ChangeEvent) {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "inherit";
    target.style.height = `${e.target.scrollHeight}px`;

    onTodoChange({
      task: target.value,
    });
  }

  function handleTodoDelete(e: React.MouseEvent) {
    onTodoDelete({ id: (e.target as HTMLInputElement).value });
  }

  function handleDblClick(e: React.MouseEvent) {
    const target = e.target as HTMLTextAreaElement;
    target.readOnly = false;
  }

  function handleKeypress(e: React.KeyboardEvent) {
    if (e.key == "Enter") {
      const target = e.target as HTMLTextAreaElement;
      target.readOnly = true;
    }
  }

  function handleBlur(e: React.FocusEvent) {
    const target = e.target as HTMLTextAreaElement;
    target.readOnly = true;
  }

  return (
    <li>
      <div className="round">
        <input
          type="checkbox"
          id={`${_id}`}
          className="checkmark"
          checked={status}
          onChange={handleTaskStatus}
        />
        <label htmlFor={`${_id}`}></label>
      </div>
      <textarea
        id={`textarea-${_id}`}
        className="todolist-task"
        value={task}
        readOnly={true}
        onBlur={handleBlur}
        onKeyDown={handleKeypress}
        onDoubleClick={handleDblClick}
        onChange={handleTodoChange}
      />
      <button className="button-rounded" value={_id} onClick={handleTodoDelete}>
        X
      </button>
    </li>
  );
}

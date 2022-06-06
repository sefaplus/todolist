import React, { BaseSyntheticEvent } from "react";
export default function TodoItem({
  id,
  value,
  onTodoChange,
  onTodoDelete,
}: {
  id: string;
  value: any;
  onTodoChange: Function;
  onTodoDelete: Function;
}) {
  const { task, status } = value;

  function handleTaskStatus(e: BaseSyntheticEvent) {
    onTodoChange({ status: (e.target as HTMLInputElement).checked });
  }
  function handleTodoChange(e: BaseSyntheticEvent) {
    onTodoChange({ task: (e.target as HTMLInputElement).value });
  }
  function handleTodoDelete(e: MouseEvent) {
    onTodoDelete({ id: (e.target as HTMLInputElement).value });
  }
  let double = false;
  function handleClick(e: MouseEvent) {
    let target = e.target as HTMLInputElement;
    if (e.detail == 1) {
      setTimeout(() => {
        // if (!double) {
        //   let checkboxStatus = document.querySelector(
        //     `input[id='${id}']`
        //   ) as HTMLInputElement;
        //   onTodoChange({ status: !checkboxStatus.checked });
        // }
        double = false;
      }, 250);
    }
    if (e.detail == 2) {
      double = true;
      target.readOnly = false;
      target.addEventListener("keypress", handleKeypress);
    }
  }
  function handleKeypress(e: KeyboardEvent) {
    if (e.key == "Enter") {
      let target = e.target as HTMLInputElement;
      target.readOnly = true;
      target.removeEventListener(
        "keypress",
        handleKeypress
      );
    }
  }
  return (
    <li onClick={handleClick as any} key={id}>
      <div className="round">
        <input
          type="checkbox"
          className="checkmark"
          value={status}
          checked={status}
          onChange={handleTaskStatus as any}
          id={id}
        />
        <label htmlFor={id}></label>
      </div>
      <input
        type="text"
        onChange={handleTodoChange as any}
        className="todolist-task"
        onClick={() => handleClick}
        value={task}
        readOnly={true}
        onBlur={(e) => (e.target.readOnly = true)}
      />
      <button
        className="button-rounded"
        value={id}
        onClick={handleTodoDelete as any}
      >
        X
      </button>
    </li>
  );
}

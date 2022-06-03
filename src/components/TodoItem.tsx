import React from 'react';
type Input = HTMLInputElement;
export default function TodoItem({
  id,
  value,
  filter,
  onTodoChange,
  onTodoDelete,
}: {
  id: any;
  value: any;
  filter: number;
  onTodoChange: Function;
  onTodoDelete: any;
}) {
  const { task, status } = value;
  function handleTaskStatus(e: Event) {
    onTodoChange({ status: (e.target as Input).checked });
  }
  function handleTodoChange(e: Event) {
    onTodoChange({ task: (e.target as Input).value });
  }
  function handleTodoDelete(e: Event) {
    onTodoDelete({ id: (e.target as Input).value });
  }
  let double = false;
  function handleClick(e: Event) {
    if ((e as any).detail == 1) {
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
    if ((e as any).detail == 2) {
      double = true;
      (e as any).target.readOnly = false;
      (e as any).target.addEventListener("keypress", handleKeypress);
    }
  }
  function handleKeypress(e: Event) {
    if ((e as any).key == "Enter") {
      (e as any).target.readOnly = true;
      (e as any).target.removeEventListener("keypress", handleKeypress);
    }
  }
  if (filter == 1 && status == 1) {
    return <></>;
  } else if (filter == 2 && status == 0) {
    return <></>;
  }
  return (
    <li onClick={handleClick as any}>
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

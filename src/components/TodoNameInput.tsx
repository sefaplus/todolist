import { MouseEventHandler, useEffect, useState } from "react";
import React from "react";
export default function TodoNameInput({
  onClick,
  onClickAllTask,
}: {
  onClick: Function;
  onClickAllTask: Function;
}) {
  let [addTaskText, setAddTaskText] = useState("");
  useEffect(() => {
    document
      .querySelector("#add-task")!
      .addEventListener("keypress", handleKeyPressses);
    return () => {
      document
        .querySelector("#add-task")!
        .removeEventListener("keypress", handleKeyPressses);
    };
  });
  const handleKeyPressses = (e: Event) => {
    if ((e as KeyboardEvent).key == "Enter") {
      handleAddTask();
    }
  };
  const handleAddTask = () => {
    onClick(addTaskText);
    setAddTaskText("");
  };

  const handleTaskTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target as HTMLInputElement;
    setAddTaskText(target.value);
  };

  const handleAllTaskComplete = (e: React.MouseEvent) => {
    onClickAllTask();
  };
  return (
    <div className="todo-name-input">
      <button onClick={(e: React.MouseEvent) => handleAllTaskComplete(e)}>
        {" "}
        ⇩{" "}
      </button>
      <input
        id="add-task"
        placeholder="What needs to be done?"
        type="text"
        value={addTaskText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleTaskTextChange(e)
        }
      />
      <button onClick={handleAddTask}>ADD</button>
    </div>
  );
}

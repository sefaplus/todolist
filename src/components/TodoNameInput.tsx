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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") handleAddTask();
  };

  const handleAddTask = () => {
    if (addTaskText.trim() !== "") {
      onClick(addTaskText);
      setAddTaskText("");
    }
  };

  const handleTaskTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target as HTMLInputElement;
    setAddTaskText(target.value);
  };

  const handleAllTaskComplete = () => {
    onClickAllTask();
  };

  return (
    <div className="todo-name-input">
      <button onClick={handleAllTaskComplete}>▼</button>
      <input
        id="add-task"
        placeholder="What needs to be done?"
        type="text"
        value={addTaskText}
        onChange={handleTaskTextChange}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleAddTask}>ADD</button>
    </div>
  );
}

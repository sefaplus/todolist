import { useEffect, useState } from "react";

export default function TodoNameInput({ onClick, onClickAllTask }) {
  let [addTaskText, setAddTaskText] = useState("");
  useEffect(() => {
    document
      .querySelector("#add-task")
      .addEventListener("keypress", handleKeyPressses);
    return () => {
      document
        .querySelector("#add-task")
        .removeEventListener("keypress", handleKeyPressses);
    };
  });
  const handleKeyPressses = (e) => {
    if (e.key == "Enter") {
      handleAddTask();
    }
  };
  const handleAddTask = (e) => {
    onClick(addTaskText);
    setAddTaskText("");
  };

  const handleTaskTextChange = (e) => {
    setAddTaskText(e.target.value);
  };

  const handleAllTaskComplete = (e) => {
    onClickAllTask();
  };
  return (
    <div className="todo-name-input">
      <button onClick={handleAllTaskComplete}> ⇩ </button>
      <input
        id="add-task"
        placeholder="What needs to be done?"
        type="text"
        value={addTaskText}
        onChange={handleTaskTextChange}
      />
      <button onClick={handleAddTask}>ADD</button>
    </div>
  );
}

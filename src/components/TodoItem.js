export default function TodoItem({
  id,
  value,
  filter,
  onTodoChange,
  onTodoDelete,
}) {
  const { task, status } = value;
  function handleTaskStatus(e) {
    onTodoChange({ status: e.target.checked });
  }
  function handleTodoChange(e) {
    onTodoChange({ task: e.target.value });
  }
  function handleTodoDelete(e) {
    onTodoDelete({ id: e.target.value });
  }
  let double = false;
  function handleClick(e) {
    if (e.detail == 1) {
      setTimeout(() => {
        if (!double) {
          let checkboxStatus = document.querySelector(
            `input[id='${id}']`
          ).checked;
          onTodoChange({ status: !checkboxStatus });
        }
        double = false;
      }, 250);
    }
    if (e.detail == 2) {
      double = true;
      e.target.readOnly = false;
      e.target.addEventListener("keypress", handleKeypress);
    }
  }
  function handleKeypress(e) {
    if (e.key == "Enter") {
      e.target.readOnly = true;
      e.target.removeEventListener("keypress", handleKeypress);
    }
  }
  if (filter == 1 && status == 1) {
    return <></>;
  } else if (filter == 2 && status == 0) {
    return <></>;
  }
  return (
    <li onClick={handleClick}>
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
        onClick={handleClick}
        value={task}
        readOnly={true}
        onBlur={(e) => (e.target.readOnly = true)}
      />
      <button className="button-rounded" value={id} onClick={handleTodoDelete}>
        X
      </button>
    </li>
  );
}

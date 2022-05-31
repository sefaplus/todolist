export default function TodoItem({value, filter, onTodoChange, onTodoDelete}) {
  const {task, status, id} = value;

  function handleTaskStatus(e) {
    onTodoChange({status: e.target.checked});
  }

  function handleTodoChange(e) {
    onTodoChange({task: e.target.value});
    }
  function handleTodoDelete(e) {
    onTodoDelete({id: e.target.value});
  }
  
  if(filter == 1 && status == 1) {
    return <></>;
  } else if(filter == 2 && status == 0) {
    return <></>;
  }
  return (
    <li key={id}>
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
      />
      <button className='button-rounded' value={id} onClick={handleTodoDelete}>X</button>
    </li>
  );
}
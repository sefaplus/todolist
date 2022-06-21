import React from "react";
import { Filter, Task } from "./TodoListApp";
export default function TaskCounter({
  localTasks,
  filter,
}: {
  localTasks: Array<Task>;
  filter: Filter;
}) {
  return (
    <p>
      Current tasks:
      {
        localTasks.filter((el) => {
          return (
            filter === Filter.ALL ||
            (el.status ? filter === Filter.COMPLETED : filter === Filter.ACTIVE)
          );
        }).length
      }
    </p>
  );
}

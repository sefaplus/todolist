import { Task } from "../components/TodoListApp";

export default class Api {
  static fetching: boolean = false;
  static data: Array<Task>;
  static timer: ReturnType<typeof setTimeout>;
  static changedTasks: Array<number> = [];
  static deletedTasks: Array<number> = [];
  pushForChange(id: number) {
    !Api.changedTasks.includes(id) ? Api.changedTasks.push(id) : null;
  }
  pushForDelete(id: number) {
    !Api.deletedTasks.includes(id) ? Api.deletedTasks.push(id) : null;
  }
  setData(newData: Array<Task>) {
    clearTimeout(Api.timer);
    Api.data = newData;
    Api.timer = setTimeout(() => this.setTask(), 1000); // Wait 1s before sending anything
  }

  async getData(setter: Function, data: Array<Task>) {
    if (!Api.fetching) {
      Api.fetching = true;
      try {
        let response = await fetch("http://localhost:5000/todos/");
        await response
          .json()
          .then((val) => setter(val || []))
          .then(() => {
            Api.fetching = false;
          });
      } catch (err) {
        console.log("Too fast: " + err);
        setter([{ id: 0, task: `Failed to Fetch ${err}`, status: true }]);
        setTimeout(() => window.location.reload(), 3000);
      }
    }
  }
  async setTask() {
    if (!Api.fetching) {
      Api.fetching = true;
      try {
        let dataToSend: Array<Task> = Api.data.filter((el) =>
          Api.changedTasks.includes(el.id)
        );
        if (Api.changedTasks.length) {
          await fetch(`http://localhost:5000/todos/${Api.changedTasks[0]}`, {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify(dataToSend),
          }).then(() => {
            Api.fetching = false;
            Api.changedTasks = [];
            console.log("Sent updates");
          });
        }
        if (Api.deletedTasks.length) {
          await fetch(`http://localhost:5000/todos/delete/`, {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify(Api.deletedTasks),
          }).then(() => {
            Api.fetching = false;
          });
        }
      } catch (err) {
        console.log("Failed at single task delete: " + err);
      } finally {
      }
    }
  }

  async saveFile() {
    if (!Api.fetching) {
      Api.fetching = true;
      await fetch("http://localhost:5000/todos/saveFile", {
        method: "POST",
      })
        .then(() => (Api.fetching = false))
        .catch((err) => console.log("Failed during save file" + err));
    }
  }
}

import { Task } from "../components/TodoListApp";

export default class Api {
  static fetching: boolean = false;
  static data: Array<Task>;
  static timer: any;
  static changedTasks: Array<number> = [];
  static deletedTasks: Array<number> = [];
  addChangeId(id: number) {
    if (!Api.changedTasks.includes(id)) {
      clearTimeout(Api.timer);
      Api.changedTasks.push(id);
      Api.timer = setTimeout(() => this.setTask(), 500); // Wait 500ms  before sending anything
    }
  }
  addDeleteId(id: number) {
    if (!Api.deletedTasks.includes(id)) {
      clearTimeout(Api.timer);
      Api.deletedTasks.push(id);
      Api.timer = setTimeout(() => this.setTask(), 500); // Wait 500ms  before sending anything
    }
  }
  setData(newData: Array<Task>) {
    Api.data = newData;
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
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }
  async setTask() {
    if (!Api.fetching) {
      Api.fetching = true;
      if (Api.changedTasks.length || Api.deletedTasks.length) {
        Api.fetching = true;
        try {
          Api.changedTasks.map(async (curId) => {
            await fetch(`http://localhost:5000/todos/${curId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json;charset=UTF-8" },
              body: JSON.stringify(Api.data.filter((el) => el.id == curId)),
            }).then(() => {
              Api.fetching = false;
            });
            Api.changedTasks.shift();
          });

          Api.deletedTasks.map(async (id) => {
            await fetch(`http://localhost:5000/todos/delete/${id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json;charset=UTF-8" },
            }).then(() => {
              Api.fetching = false;
            });
            Api.changedTasks.shift();
          });
        } catch (err) {
          console.log("Failed at single task delete: " + err);
        } finally {
        }
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

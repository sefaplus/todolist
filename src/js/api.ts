import { Task } from "../components/TodoListApp";

export default class Api {
  static fetching: boolean = false;
  static needUpdate: boolean = false;
  static data: Array<Task>;
  static timer: any;
  setData(newData: Array<Task>) {
    clearTimeout(Api.timer);
    Api.data = newData;
    Api.needUpdate = true;
    Api.timer = setTimeout(() => this.sendData(), 500); // Wait 500ms  before sending anything
  }

  async getData(setter: Function, data: Array<Task>) {
    if (!Api.fetching) {
      Api.fetching = true;

      try {
        let response = await fetch("http://localhost:5000/getTodos");
        await response
          .json()
          .then((val) => setter(val || []))
          .then(() => {
            Api.fetching = false;
            Api.needUpdate = false;
          });
      } catch (err) {
        console.log("Too fast: " + err);
        setter([{ id: 0, task: `Failed to Fetch ${err}`, status: true }]);
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }

  async sendData() {
    if (!Api.fetching) {
      Api.fetching = true;

      try {
        await fetch("http://localhost:5000/setTodos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(Api.data),
        })
          .then(() => {
            Api.fetching = false;
            Api.needUpdate = false;
          })
          .then(() => {
            if (Api.needUpdate) this.sendData();
          });
      } catch (err) {
        console.log("Failed to post data:" + err);
      }
    }
  }
}

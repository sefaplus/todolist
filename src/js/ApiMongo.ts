import { Task } from "../components/TodoListApp";
export default class API {
  static fetching: boolean = false;
  static toUpdate: Array<string> = []; // Array of ids to update
  static toDelete: Array<string> = [];
  static Timer: ReturnType<typeof setTimeout>;
  static data: Array<Task> = [];
  static setLocalTasksFn: Function;

  setApiData(tasks: Array<Task>) {
    clearTimeout(API.Timer);
    API.data = tasks;

    if (API.toUpdate.length > 0 && API.toDelete.length > 0) {
      API.Timer = setTimeout(() => {
        this.Update(API.toUpdate);
        this.Delete(API.toDelete);
      }, 1000);
    } else if (API.toUpdate.length > 0)
      API.Timer = setTimeout(() => {
        this.Update(API.toUpdate);
      }, 1000);
    else if (API.toDelete.length > 0) {
      API.Timer = setTimeout(() => {
        this.Delete(API.toDelete);
      }, 1000);
    }
  }
  addToUpdateList(id: string) {
    API.toUpdate.includes(id) ? null : API.toUpdate.push(id);
  }
  addToDeleteList(id: string) {
    API.toDelete.includes(id) ? null : API.toDelete.push(id);
  }
  async fetchAndSet(setter: Function, URI: string, navigator: Function) {
    if (!API.fetching) {
      API.fetching = true;

      try {
        let response = await fetch(URI, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        });
        if (response.ok) {
          let val = await response.json();

          if (val.notLogged) {
            navigator("/");
          } else {
            setter(val);
          }

          API.fetching = false;
        } else {
          API.fetching = false;

          console.log("fetchAndSet succeded but not with OK status");

          throw new Error("Got status " + response.status);
        }
      } catch (err) {
        setter([{ id: 0, task: `${err}. Please try again`, status: false }]);
      }
    }
  }

  private async Update(list: Array<string>) {
    // Updates and Adds tasks that yet not exist.
    let dataToSend: Array<Task> = API.data.filter((el: Task) =>
      list.includes(el._id)
    );

    if (dataToSend.length > 0) {
      let response = await fetch("http://localhost:5000/api/update", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(dataToSend),
      })
        .then(() => (API.toUpdate = []))
        .then(() => console.log("Sent Updates to Server"))
        .catch((err) => {
          console.log("Error while updating. ", err);
        });
    }
  }
  private async Delete(list: Array<string>) {
    if (list.length > 0) {
      let response = await fetch("http://localhost:5000/api/delete", {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(list),
      })
        .then(() => {
          API.toDelete = [];
          console.log("Sent Delete ids to server");
        })
        .catch((err) => console.log("Error while deleting. ", err));
    } else {
      console.log("Nothing to delete");
    }
  }
  async saveToCloud(setter: Function) {
    // Causes to save tasks to MongoDB cloud.
    // Causes tasks to be refetched
    let response = await fetch("http://localhost:5000/api/updateCloud", {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
    if (response.ok) {
      let tasks = await response.json();

      setter(tasks);
    } else {
      console.log("saveToCloud succeded but not with OK status");

      throw new Error("Got status " + response.status);
    }
  }
  async setOwnTaskList(content: string, setter: Function) {
    let response = await fetch("http://localhost:5000/api/setOwnTaskList", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: content,
    });
    if (response.ok) {
      let val = await response.json();

      setter(val);
    }
  }
}

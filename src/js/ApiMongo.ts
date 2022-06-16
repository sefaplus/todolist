import { Task } from "../components/TodoListApp";
export default class ApiMongo {
  static fetching: boolean = false;
  static toUpdate: Array<string> = []; // Array of ids to update
  static toDelete: Array<string> = [];
  static Timer: ReturnType<typeof setTimeout>;
  static data: Array<Task> = [];
  static setLocalTasksFn: Function;

  /* Error */
  static setErrorText: Function;
  static setWarningVisible: Function;

  static setApiData(tasks: Array<Task>) {
    clearTimeout(ApiMongo.Timer);
    ApiMongo.data = tasks;

    if (ApiMongo.toUpdate.length > 0 && ApiMongo.toDelete.length > 0) {
      ApiMongo.Timer = setTimeout(() => {
        this.Update(ApiMongo.toUpdate);
        this.Delete(ApiMongo.toDelete);
      }, 1000);
    } else if (ApiMongo.toUpdate.length > 0)
      ApiMongo.Timer = setTimeout(() => {
        this.Update(ApiMongo.toUpdate);
      }, 1000);
    else if (ApiMongo.toDelete.length > 0) {
      ApiMongo.Timer = setTimeout(() => {
        this.Delete(ApiMongo.toDelete);
      }, 1000);
    }
  }
  static addToUpdateList(id: string) {
    ApiMongo.toUpdate.includes(id) ? null : ApiMongo.toUpdate.push(id);
  }
  static addToDeleteList(id: string) {
    ApiMongo.toDelete.includes(id) ? null : ApiMongo.toDelete.push(id);
  }
  static async fetchAndSet(setter: Function, URI: string, navigator: Function) {
    if (!ApiMongo.fetching) {
      ApiMongo.fetching = true;

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

          ApiMongo.fetching = false;
        } else {
          ApiMongo.fetching = false;
          ApiMongo.showWarning(
            "fetchAndSet succeded but not with an OK status"
          );
          throw new Error("Got status " + response.status);
        }
      } catch (err) {
        setter([
          { id: 0, task: `${err}. Please try again later`, status: false },
        ]);
      }
    }
  }

  private static async Update(list: Array<string>) {
    // Updates and Adds tasks that yet not exist.
    let dataToSend: Array<Task> = ApiMongo.data.filter((el: Task) =>
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
        .then(() => (ApiMongo.toUpdate = []))
        .then(() => console.log("Sent Updates to Server"))
        .catch((err) => {
          ApiMongo.showWarning(`"Error while updating tasks. ${err}`);
        });
    }
  }
  private static async Delete(list: Array<string>) {
    if (list.length > 0) {
      let response = await fetch("http://localhost:5000/api/delete", {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(list),
      })
        .then(() => {
          ApiMongo.toDelete = [];
          console.log("Sent Delete ids to server");
        })
        .catch((err) => {
          ApiMongo.showWarning(`Error while deleting. ${err}`);
        });
    } else {
      console.log("Nothing to delete");
    }
  }
  static async saveToCloud(setter: Function) {
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
      ApiMongo.showWarning("Syncing cloud succeded but not with an OK status");
      throw new Error("Got status " + response.status);
    }
  }
  static async setOwnTaskList(content: string, setter: Function) {
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
    } else {
      ApiMongo.showWarning(
        "Upload from file succeded but not with an OK status"
      );
    }
  }

  static async setWarning(
    setErrorTextFn: Function,
    setWarningVisibleFn: Function
  ) {
    ApiMongo.setErrorText = setErrorTextFn;
    ApiMongo.setWarningVisible = setWarningVisibleFn;
  }
  private static showWarning(errorTxt: string) {
    ApiMongo.setErrorText(errorTxt);
    ApiMongo.setWarningVisible(true);
    console.log(errorTxt);
  }
}

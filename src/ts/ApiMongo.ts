import { Task } from "../components/TodoListApp";
export default class ApiMongo {
  static toUpdate: Array<string> = []; // Array of ids to update
  static toDelete: Array<string> = [];
  static Timer: ReturnType<typeof setTimeout>;
  static data: Array<Task> = [];
  static setLocalTasksFn: Function;
  static currentlyFetching: any;
  /* Error */
  static setErrorText: Function;
  static setWarningVisible: Function;

  private static fetcher = {
    // API Fetching preventor.
    setFetching: () => {
      ApiMongo.currentlyFetching = new Promise(() => {});
    },

    resolveFetching: () => {
      Promise.resolve(ApiMongo.currentlyFetching);
      ApiMongo.currentlyFetching = undefined;
    },

    getFetcher: () => {
      return ApiMongo.currentlyFetching;
    },
  };

  static setApiData(tasks: Array<Task>) {
    clearTimeout(ApiMongo.Timer);

    ApiMongo.data = tasks;
    const uLen = ApiMongo.toUpdate.length;
    const dLen = ApiMongo.toDelete.length;

    if (uLen && dLen) {
      ApiMongo.Timer = setTimeout(() => {
        this.Update(ApiMongo.toUpdate);
        this.Delete(ApiMongo.toDelete);
      }, 1000);
    } else if (uLen) {
      ApiMongo.Timer = setTimeout(() => {
        this.Update(ApiMongo.toUpdate);
      }, 1000);
    } else if (dLen) {
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
    await ApiMongo.fetcher.getFetcher();
    ApiMongo.fetcher.setFetching();
    try {
      let response = await fetch(URI, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
      if (response.ok) {
        let val = await response.json();

        if (val.logged == false) {
          ApiMongo.fetcher.resolveFetching();
          navigator("/");
        } else {
          ApiMongo.fetcher.resolveFetching();
          setter(val);
        }
      } else {
        ApiMongo.fetcher.resolveFetching();
        ApiMongo.showWarning("fetchAndSet succeded but not with an OK status");

        throw new Error("Got status " + response.status);
      }
    } catch (err) {
      ApiMongo.fetcher.resolveFetching;
      setter([
        { id: 0, task: `${err}. Please try again later`, status: false },
      ]);
    }
  }

  private static async Update(list: Array<string>) {
    // Updates and Adds tasks that yet not exist.
    await ApiMongo.fetcher.getFetcher();
    ApiMongo.fetcher.setFetching();

    let dataToSend: Array<Task> = ApiMongo.data.filter((el: Task) =>
      list.includes(el._id)
    );

    if (dataToSend.length) {
      await fetch("http://localhost:5000/api/update", {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(dataToSend),
      })
        .then(() => {
          console.log("Sent Updates to Server");
          ApiMongo.toUpdate = [];
          ApiMongo.fetcher.resolveFetching();
        })
        .catch((err) => {
          ApiMongo.fetcher.resolveFetching();
          ApiMongo.showWarning(`"Error while updating tasks. ${err}`);
        });
    }
  }

  private static async Delete(list: Array<string>) {
    if (list.length) {
      await ApiMongo.fetcher.getFetcher();
      ApiMongo.fetcher.setFetching();

      await fetch("http://localhost:5000/api/delete", {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(list),
      })
        .then(() => {
          ApiMongo.toDelete = [];
          ApiMongo.fetcher.resolveFetching();
          console.log("Sent Delete ids to server");
        })
        .catch((err) => {
          ApiMongo.fetcher.resolveFetching();
          ApiMongo.showWarning(`Error while deleting. ${err}`);
        });
    } else {
      console.log("Nothing to delete");
    }
  }

  static async saveToCloud() {
    await ApiMongo.fetcher.getFetcher();
    ApiMongo.fetcher.setFetching();
    // Causes to save tasks to MongoDB cloud.
    // Causes tasks to be refetched
    try {
      let response = await fetch("http://localhost:5000/api/updateCloud", {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
      if (response.ok) {
        let tasks = await response.json();
        ApiMongo.fetcher.resolveFetching();

        return tasks;
      } else {
        ApiMongo.showWarning(
          "Syncing cloud succeded but not with an OK status"
        );
        ApiMongo.fetcher.resolveFetching();

        throw new Error("Got status " + response.status);
      }
    } catch (err) {
      console.log(err);

      ApiMongo.showWarning(err as any);
    }
  }

  static async setOwnTaskList(content: string, setter: Function) {
    await ApiMongo.fetcher.getFetcher();
    ApiMongo.fetcher.setFetching();

    try {
      let response = await fetch("http://localhost:5000/api/setOwnTaskList", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: content,
      });
      if (response.ok) {
        let val = await response.json();
        if (val.hasOwnProperty("errorMsg")) {
          ApiMongo.fetcher.resolveFetching();

          ApiMongo.showWarning(val.errorMsg);
        } else {
          setter(val);
          ApiMongo.fetcher.resolveFetching();
        }
      } else {
        ApiMongo.fetcher.resolveFetching();
        ApiMongo.showWarning(
          "Upload from file succeded but not with an OK status"
        );
      }
    } catch (err) {
      ApiMongo.fetcher.resolveFetching();
      ApiMongo.showWarning(`Erorr: ${err}`);
    }
  }

  static setWarning(setErrorTextFn: Function, setWarningVisibleFn: Function) {
    ApiMongo.setErrorText = setErrorTextFn;
    ApiMongo.setWarningVisible = setWarningVisibleFn;
  }

  public static showWarning(errorTxt: string) {
    ApiMongo.setErrorText(errorTxt);
    ApiMongo.setWarningVisible(true);
    console.log(errorTxt);
  }
}

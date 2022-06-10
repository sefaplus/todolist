export default class LoginAPI {
  async login(login: string, pass: string) {
    let response: any;
    try {
      response = await fetch("http://localhost:5000/user/Login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify({ login: login, pass: pass }),
      });
    } catch (err) {
      console.log("Error during login. ", err);
    }
    if (response.ok) {
      let val = await response.json();
      return val;
    }
  }
  async checkLogin() {
    let response: any;
    try {
      response = await fetch("http://localhost:5000", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
    } catch (err) {
      console.log("Error during login. ", err);
    }
    if (response.ok) {
      let val = await response.json();
      return val;
    }
  }
}

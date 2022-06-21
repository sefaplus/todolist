import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningDialog from "../components/WarningDialog";
import ApiLogin from "../ts/ApiLogin";

export default function Login() {
  let navigate = useNavigate();
  let [login, setLogin] = useState("user1");
  let [password, setPassword] = useState("password1");
  let [loggingStatus, setLoggingStatus] = useState("Please sign in..");

  let [warningVisible, setWarningVisible] = useState(false);
  let [errorText, setErrorText] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoggingStatus("LOGGING IN...");
    let response = await ApiLogin.login(login, password);
    if (response.loggedIn) {
      navigate("/todolist");
    } else {
      setErrorText(response.message);
      setWarningVisible(true);
      setLoggingStatus("Please sign in..");
    }
  }

  return (
    <>
      <WarningDialog
        errorText={errorText}
        warningVisible={warningVisible}
        setWarningVisible={setWarningVisible}
      />
      <main className="login-container">
        <h1>{loggingStatus}</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="login"> LOGIN:</label>
          <input
            type="text"
            value={login}
            id="login"
            placeholder="yourId"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLogin(e.target.value)
            }
          />
          <label htmlFor="password"> Password:</label>
          <input
            type="text"
            value={password}
            id="password"
            placeholder="yourPass"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <button type="button" onClick={handleSubmit}>
            Login
          </button>
          <button onClick={() => navigate("/signup")}> Sign up</button>
        </form>
      </main>
    </>
  );
}

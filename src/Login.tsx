import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginAPI from "./js/ApiLogin";

const API = new LoginAPI;
export default function Login() {
  let navigate = useNavigate();
  let [login, setLogin] = useState('user1');
  let [password, setPassword] = useState('password1');
  let [loggingStatus, setLoggingStatus] = useState('')

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoggingStatus('LOGGING IN...');
    let response = await API.login(login, password);
    setLoggingStatus(JSON.stringify(response));
  }
  async function checkLogin(e: any) {
   let response = await API.checkLogin();
   setLoggingStatus(JSON.stringify(response))
  }
  useEffect(()=> {
  })
  return (
    <main style={{ padding: "1rem 0" }}>
      <h1>{loggingStatus}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={login}
          id="login"
          placeholder="yourId"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
        />
        <input
          type="text"
          value={password}
          id="password"
          placeholder="yourPass"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <button type="submit" value="SUBMIT">
          Login{" "}
        </button>
      </form>
      <button onClick={checkLogin}> Am i logged in?</button>
      <Link to="/todolist">GO TO TODO LIST</Link>
    </main>
  );
}

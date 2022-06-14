import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginAPI from "./js/ApiLogin";

const API = new LoginAPI;
export default function Login() {
  let navigate = useNavigate();
  let [login, setLogin] = useState('user1');
  let [password, setPassword] = useState('password1');
  let [loggingStatus, setLoggingStatus] = useState('Please sign in..')

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoggingStatus('LOGGING IN...');
    let response = await API.login(login, password);
    navigate('/todolist')
  }
  async function checkLogin(e: any) {
   let response = await API.checkLogin();
   setLoggingStatus(JSON.stringify(response))
  }
  useEffect(()=> {
  })
  return (
    <main className="login-container">
      <h1>{loggingStatus}</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="login"> LOGIN:</label>
        <input
          type="text"
          value={login}
          id="login"
          placeholder="yourId"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
        />
        <label htmlFor="password"> LOGIN:</label>
        <input
          type="text"
          value={password}
          id="password"
          placeholder="yourPass"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <button type="submit" value="SUBMIT">
          Login
        </button>
      </form>
    </main>
  );
}

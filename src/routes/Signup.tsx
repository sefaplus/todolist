import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningDialog from "../components/WarningDialog";
import ApiSignup from "../js/ApiSignUp";

export default function Signup() {
  let navigate = useNavigate();
  let [name, setName] = useState("");
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  /* Error */
  let [errorText, setErrorText] = useState("");
  let [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    ApiSignup.setWarningProps(setErrorText, setWarningVisible);
  }, []);
  const fn = {
    name: (v: string) => setName(v),
    login: (v: string) => setLogin(v),
    password: (v: string) => setPassword(v),
    confirmPassword: (v: string) => setConfirmPassword(v),
  };

  function handleChange(e: React.ChangeEvent) {
    const id = e.target.id;
    const val = (e.target as HTMLInputElement).value;
    fn[id as keyof typeof fn](val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const created = await ApiSignup.signup(
      name,
      login,
      password,
      confirmPassword
    );
    if (created) {
      navigate("/todolist");
    }
  }

  function signup(name: string, login: string, password: string) {}

  return (
    <>
      <WarningDialog
        errorText={errorText}
        warningVisible={warningVisible}
        setWarningVisible={setWarningVisible}
      />
      <div>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="name">Enter your name:</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Your name.."
            onChange={handleChange}
          />

          <label htmlFor="login">Enter your login:</label>
          <input
            type="text"
            id="login"
            value={login}
            placeholder="Your login.."
            onChange={handleChange}
          />

          <label htmlFor="password">Enter your password:</label>
          <input
            type="text"
            id="password"
            value={password}
            placeholder="Your password.."
            onChange={handleChange}
          />

          <label htmlFor="confirmPassword">Confirm your password:</label>
          <input
            type="text"
            id="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm password.."
            onChange={handleChange}
          />
          <button type="button" onClick={handleSubmit}>
            Signup
          </button>
        </form>
      </div>
    </>
  );
}

export default class ApiSignup {
  public static showWarning: Function;

  static setWarningProps(setError: Function, setVisible: Function) {
    ApiSignup.showWarning = (text: string) => {
      setVisible(true);
      setError(text);
    };
  }

  private static validateForm(
    name: string,
    login: string,
    password: string,
    confirmPassword: string
  ) {
    let regEx = new RegExp("(?=^.{6,}$)(?=.*[0-9])(?=.*[a-z]).*");

    /* All fields set */
    if (
      !name.length ||
      !login.length ||
      !password.length ||
      !confirmPassword.length
    ) {
      ApiSignup.showWarning("All fields must be set!");
      return false;
    }

    /* Login is bigger than 3 */
    if (login.length < 5) {
      ApiSignup.showWarning("Login should be at least 5 characters long!");
      return false;
    }

    /* Password is > 6 characters long and contaisn 1 number and 1 letter */
    if (!regEx.test(password)) {
      ApiSignup.showWarning(
        "Password must contain at least 6 characters, 1 number and 1 letter."
      );
      return false;
    }

    if (password !== confirmPassword) {
      ApiSignup.showWarning("Passwords must match!");
      return false;
    }

    /* Everything passed */
    return true;
  }

  static async signup(
    name: string,
    login: string,
    password: string,
    confirmPassword: string
  ) {
    const body = {
      name: name,
      login: login,
      password: password,
      confirmPassword: confirmPassword,
    };
    const response = await fetch("http://localhost:5000/api/registration", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.error) {
        ApiSignup.showWarning(result.message);
      } else {
        return true;
      }
    }
  }
}

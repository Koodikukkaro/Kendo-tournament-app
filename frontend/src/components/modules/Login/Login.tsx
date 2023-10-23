import React, { useState } from "react";
import "./login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

interface LocationProps {
  state: {
    from: Location;
  };
}

interface FormData {
  login: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation() as unknown as LocationProps;
  const from = location.state?.from?.pathname ?? "/";

  const [formData, setFormData] = useState<FormData>({
    login: "",
    password: ""
  });

  const onHandleSubmit = async (): Promise<void> => {
    await login();
    navigate(from, { replace: true });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  return (
    <form id="loginForm" className="form" onSubmit={onHandleSubmit}>
      <h1 className="header">Login</h1>

      <div className="field">
        <br />
        <label htmlFor="login">Username or email</label>
        <br />
        <input
          type="text"
          name="login"
          id="login"
          placeholder="Type your username or email"
          value={formData.login}
          onChange={(e) => {
            handleInputChange(e, "login");
          }}
          required
        />
      </div>

      <div className="field">
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Type your password"
          value={formData.password}
          onChange={(e) => {
            handleInputChange(e, "password");
          }}
          required
        />
        <i className="fa-solid fa-eye" id="eye" />
      </div>
      <p className="forgotPassword">
        <a href="url">Forgot your password?</a>
      </p>
      <br />
      <div className="field">
        <button type="submit" id="btnRegister">
          Log in
        </button>
      </div>
      <br />
      <p className="register">
        Dont have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};

export default LoginForm;

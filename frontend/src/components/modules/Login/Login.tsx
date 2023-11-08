import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import "../../common/Style/common.css";
import "./login.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Footer from "components/common/Footer/Footer";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

interface LocationProps {
  state: {
    from: Location;
  };
}

interface FormData {
  login: string;
  password: string;
}

interface ErrorMessage {
  message: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation() as unknown as LocationProps;
  const from = location.state?.from?.pathname ?? "/";
  const loginAPI = "http://localhost:8080/api/auth/logis"; // transfer the base URL into env file.

  const [formData, setFormData] = useState<FormData>({
    login: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
    message: ""
  });

  const onHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submit behavior
    try {
      const errorContext = ["requestBody.password", "requestBody.login"];
      const response = await fetch(loginAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.login,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Store the token, and update auth state
        await login();
        navigate(from, { replace: true });
      } else {
        // TODO: display a message to the user
        const errorData = await response.json();
        const context = errorData.errors[0].context;
        for (let i = 0; i < errorContext.length; i++) {
          const key = errorContext[i];
          if (context[key] !== undefined) {
            setErrorMessage({
              message: context[key].message
            });
            break; // found the error message
          }
        }
      }
    } catch (error) {
      // TODO: display a message to the user
      console.log(error);
      setErrorMessage({
        message: "Unknown Error Occurred. Please try again later!"
      });
    }
  };

  const handleClose = (): void => {
    setErrorMessage({
      message: ""
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ): void => {
    const target = event.target as HTMLInputElement; // Type assertion
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  return (
    <div className="gridContainer">
      <Grid container className="">
        {/* Left Panel */}
        <Grid item xs={12} sm={7}>
          <div className="leftPanel">
            <form id="loginForm" className="form" onSubmit={onHandleSubmit}>
              <Typography variant="h4" component="h4">
                Sign In!
              </Typography>

              {errorMessage.message !== "" && (
                <Paper className="error-message">
                  <p>{errorMessage.message}</p>
                  <CloseIcon className="cross-icon" onClick={handleClose} />
                </Paper>
              )}
              <TextField
                label="Username/Email"
                type="text"
                name="login"
                id="login"
                placeholder="Type your username or email"
                value={formData.login}
                onChange={(e) => {
                  handleInputChange(e, "login");
                }}
                margin="normal"
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                id="password"
                placeholder="Type your password"
                value={formData.password}
                onChange={(e) => {
                  handleInputChange(e, "password");
                }}
                margin="normal"
                required
                fullWidth
              />

              <Typography variant="body2" className="forgotPassword">
                <Link to="url">Forgot your password?</Link>
              </Typography>

              <Button
                type="submit"
                id="btn-login"
                variant="contained"
                color="primary"
                className="login-button"
              >
                Log in
              </Button>
            </form>
          </div>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} sm={5} className="rightPanel">
          <div className="">
            <Typography component="h3" variant="h3">
              Hello, Friend!
            </Typography>
            <Typography variant="body1">
              Enter your personal details and start your journey with us!
            </Typography>
            <br />
            <Button variant="contained" color="success" className="sign-up-btn">
              <Link to="/register" className="sign-up-link">
                Sign Up
              </Link>
            </Button>
          </div>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default LoginForm;

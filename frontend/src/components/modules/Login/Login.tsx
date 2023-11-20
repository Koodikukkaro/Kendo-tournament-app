import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShowError from "components/common/ErrorMessage/Error";
import Box from "@mui/material/Box";

interface LocationProps {
  state: {
    from: Location;
  };
}

interface FormData {
  email: string;
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
  const loginAPI = "http://localhost:8080/api/auth/login"; // transfer the base URL into env file.

  const [formData, setFormData] = useState<FormData>({
    email: "",
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
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        await login();
        navigate(from, { replace: true });
      } else {
        setErrorMessage({ message: "This does not work yet! :)" });
      }
    } catch (error) {
      console.log(error);
      setErrorMessage({
        message: "Unknown Error Occurred. Please try again later!"
      });
    }
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
    <Grid container display="flex" justifyContent="center">
      <Box
        sx={{
          marginTop: 8,
          padding: "1em",
          width: "500px"
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          fontWeight="bold"
          alignSelf="start"
        >
          {"Sign in"}
        </Typography>
        <Box
          component="form"
          onSubmit={onHandleSubmit}
          noValidate
          sx={{ mt: 2, display: "flex", flexDirection: "column" }}
        >
          <ShowError message={errorMessage.message}></ShowError>
          <TextField
            label="Email"
            required
            type="text"
            name="email"
            id="email"
            placeholder="Type your email"
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e, "email");
            }}
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

          <Box margin="auto" width="200px">
            <Button
              type="submit"
              id="btn-login"
              variant="contained"
              color="primary"
              className="login-button"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              {"Log in"}
            </Button>
          </Box>
          <Grid container gap="10px">
            <Grid item xs>
              <Typography variant="body2">
                <Link to="/404">{"Forgot password?"}</Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <Link to="/register">{"Don't have an account? Sign Up"}</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default LoginForm;

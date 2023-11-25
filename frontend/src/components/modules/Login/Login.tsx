import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { type TextFieldConfig } from "types/forms";
import { type LoginRequest } from "types/requests";
import useToast from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { type LocationState } from "types/global";

interface LoginFormData {
  email: string;
  password: string;
}

const initialFormData: LoginFormData = {
  email: "",
  password: ""
};

const textFields: Array<TextFieldConfig<LoginFormData>> = [
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    required: true
  }
];

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as LocationState;
  const showToast = useToast();

  console.log(location);
  const { login } = useAuth();
  const from = location.state?.from?.pathname ?? "/";
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);

  const onHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      await login(formData as LoginRequest);
      showToast("Login successful!", "success");
      navigate(from, { replace: true });
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ): void => {
    const target = event.target as HTMLInputElement;
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
          {textFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              name={field.name}
              id={field.name}
              required
              fullWidth
              margin="normal"
              autoComplete="off"
              value={formData[field.name]}
              onChange={(e) => {
                handleInputChange(e, field.name);
              }}
            />
          ))}

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

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
            <Typography variant="body1">This is a paragraph text.</Typography>
            <br />
            <Button variant="outlined" color="primary">
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

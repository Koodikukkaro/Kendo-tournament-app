import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ShowError from "components/common/ErrorMessage/Error";
import Footer from "components/common/Footer/Footer";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registration.css";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const registerAPI = "http://localhost:8080/api/user/register";

  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    tel: "",
    password: "",
    passwordConfirmation: "",
    rank: "",
    club: "",
    suomisport: "",
    underage: false,
    guardianEmail: "",
    conditions: false
  });

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

  const onHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submit behavior
    try {
      const errorContext = ["requestBody.password", "requestBody.login"];
      const response = await fetch(registerAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.tel,
          firstName: formData.firstname,
          lastName: formData.lastname,
          clubName: formData.club,
          danRank: formData.rank,
          underage: formData.underage,
          guardiansEmail: formData.guardianEmail,
          role: "admin" // TODO: MUST REMOVE LATER.
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // TODO: throw a message here to tell the user to login. or maybe a timed msg or soemthing.
        navigate("/login", { replace: true });
      } else {
        const errorData = await response.json();
        const context = errorData.errors[0].context;
        for (let i = 0; i < errorContext.length; i++) {
          const key = errorContext[i];
          if (context[key] !== undefined) {
            setErrorMessage(context[key].message);
            break; // found the error message
          }
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Unknown Error Occurred. Please try again later!");
    }
  };

  return (
    <div>
      <Grid container className="container">
        <Grid item xs={12} md={7} className="left-reg-panel">
          <Grid item xs={12} className="left-page-info">
            <Typography variant="h1" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body1">
              Already have an account?
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </Typography>
            <Typography variant="body2">
              Fill in the fields below. Fields marked with * are required.
            </Typography>
          </Grid>
          <form
            id="registerForm"
            className="form-reg"
            onSubmit={onHandleSubmit}
          >
            <ShowError message={errorMessage}></ShowError>
            <TextField
              label="First Name"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.firstname}
              onChange={(e) => {
                handleInputChange(e, "firstname");
              }}
            />

            <TextField
              label="Last Name"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.lastname}
              onChange={(e) => {
                handleInputChange(e, "lastname");
              }}
            />

            <TextField
              label="Email Address"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.email}
              type="email"
              error={formData.email !== "" && !isValidEmail(formData.email)}
              helperText={
                formData.email !== "" && !isValidEmail(formData.email)
                  ? "Please enter a valid email"
                  : ""
              }
              onChange={(e) => {
                handleInputChange(e, "email");
              }}
            />

            <TextField
              label="Username"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={(e) => {
                handleInputChange(e, "username");
              }}
            />

            <TextField
              label="Phone Number"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.tel}
              type="number"
              onChange={(e) => {
                handleInputChange(e, "tel");
              }}
              helperText="Enter your phone number"
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => {
                handleInputChange(e, "password");
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={formData.passwordConfirmation}
              onChange={(e) => {
                handleInputChange(e, "passwordConfirmation");
              }}
            />

            <TextField
              label="Dan Rank"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.rank}
              onChange={(e) => {
                handleInputChange(e, "rank");
              }}
            />

            <TextField
              label="Club"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.club}
              onChange={(e) => {
                handleInputChange(e, "club");
              }}
            />

            <TextField
              label="SuomiSport ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.suomisport}
              onChange={(e) => {
                handleInputChange(e, "suomisport");
              }}
            />

            {/* For checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.underage}
                  onChange={(e) => {
                    handleInputChange(e, "underage");
                  }}
                  name="underage"
                />
              }
              label="I'm underage"
            />
            {formData.underage && (
              <TextField
                label="Guardian's Email"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                value={formData.guardianEmail}
                error={
                  formData.guardianEmail !== "" &&
                  !isValidEmail(formData.guardianEmail)
                }
                helperText={
                  formData.guardianEmail !== "" &&
                  !isValidEmail(formData.guardianEmail)
                    ? "Please enter a valid email"
                    : ""
                }
                onChange={(e) => {
                  handleInputChange(e, "guardianEmail");
                }}
              />
            )}
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={formData.conditions}
                  onChange={(e) => {
                    handleInputChange(e, "conditions");
                  }}
                  name="conditions"
                />
              }
              label="By Checking this box, I agree to the Terms and Condition"
            />
            <br />
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </Grid>

        <Grid item xs={12} sm={5} className="right-reg-panel">
          <div className="right-container">
            <Typography component="h3" variant="h3">
              Already have an Account?
            </Typography>
            <br />
            <Button variant="contained" color="success">
              <Link to="/login" className="login-btn">
                Log in
              </Link>
            </Button>
          </div>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default RegisterForm;

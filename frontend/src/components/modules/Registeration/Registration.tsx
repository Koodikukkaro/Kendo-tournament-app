import React, { useState } from "react";
import "./registration.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Footer from "components/common/Footer/Footer";
import { Link } from "react-router-dom";

const RegisterForm: React.FC = () => {
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

  return (
    <div>
      <Grid container className="container">
        <Grid item xs={12} md={7} className="leftRegPanel">
          <form id="registerForm" className="formReg">
            <Typography variant="h2" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body1">
              Already have an account?
              <Link to="/login" className="loginLink">
                Log in
              </Link>
            </Typography>
            <Typography variant="body2">
              Fill in the fields below. Fields marked with * are required.
            </Typography>

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
              label="Password"
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
                onChange={(e) => {
                  handleInputChange(e, "guardianEmail");
                }}
              />
            )}

            <br />

            <Typography variant="caption">
              By clicking the submit button, you agree to abide by the Terms and
              Condition.
            </Typography>
            <br />
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </Grid>

        <Grid item xs={12} sm={5} className="rightRegPanel">
          <div className="right-container">
            <Typography component="h3" variant="h3">
              Already a Friend?
            </Typography>
            <Typography variant="body2">
              Login with your personal info!
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

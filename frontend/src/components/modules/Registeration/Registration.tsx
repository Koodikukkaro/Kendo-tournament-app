import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ShowError from "components/common/ErrorMessage/Error";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

const isValidEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};

interface RegisterFormData {
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  nationality: string;
  inNationalTeam: boolean;
  suomisportId?: string;
  clubName?: string;
  danRank?: string;
  underage: boolean;
  guardiansEmail?: string;
  conditions: boolean;
}
const initialFormData: RegisterFormData = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  password: "",
  passwordConfirmation: "",
  nationality: "",
  inNationalTeam: false,
  suomisportId: "",
  clubName: "",
  danRank: "",
  underage: false,
  conditions: false
};

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const registerAPI = "http://localhost:8080/api/user/register";

  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof RegisterFormData
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
      const response = await fetch(registerAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // TODO: throw a message here to tell the user to login. or maybe a timed msg or soemthing.
        navigate("/login", { replace: true });
      } else {
        setErrorMessage("This is not working yet! :)");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Unknown Error Occurred. Please try again later!");
    }
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
        <Box display="flex" flexDirection="column" gap="5px" width="100%">
          <Typography component="h1" variant="h5" fontWeight="bold">
            {"Create an account"}
          </Typography>
          <Typography variant="body1">
            {"Already have an account? "}
            <Link to="/login">{"Sign In"}</Link>
          </Typography>
          <Typography variant="body2">
            {"Fill in the fields below. Fields marked with * are required."}
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={onHandleSubmit}
          noValidate
          sx={{ mt: 2, display: "flex", flexDirection: "column" }}
        >
          <ShowError message={errorMessage}></ShowError>
          <TextField
            label="First Name"
            required
            fullWidth
            value={formData.firstName}
            onChange={(e) => {
              handleInputChange(e, "firstName");
            }}
          />

          <TextField
            label="Last Name"
            required
            fullWidth
            value={formData.lastName}
            onChange={(e) => {
              handleInputChange(e, "lastName");
            }}
            margin="normal"
          />

          <TextField
            label="Email"
            required
            type="email"
            name="email"
            id="email"
            error={formData.email !== "" && !isValidEmail(formData.email)}
            helperText={
              formData.email !== "" && !isValidEmail(formData.email)
                ? "Please enter a valid email"
                : ""
            }
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e, "email");
            }}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Phone Number"
            required
            fullWidth
            margin="normal"
            type="number"
            value={formData.phoneNumber}
            onChange={(e) => {
              handleInputChange(e, "phoneNumber");
            }}
          />

          <TextField
            label="Password"
            type="password"
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
            required
            fullWidth
            margin="normal"
            value={formData.passwordConfirmation}
            onChange={(e) => {
              handleInputChange(e, "passwordConfirmation");
            }}
          />

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={formData.userName}
            onChange={(e) => {
              handleInputChange(e, "userName");
            }}
          />

          <TextField
            label="Nationality"
            fullWidth
            margin="normal"
            value={formData.nationality}
            onChange={(e) => {
              handleInputChange(e, "nationality");
            }}
          />

          <TextField
            label="Dan Rank"
            fullWidth
            margin="normal"
            value={formData.danRank}
            onChange={(e) => {
              handleInputChange(e, "danRank");
            }}
          />

          <TextField
            label="Club"
            fullWidth
            margin="normal"
            value={formData.clubName}
            onChange={(e) => {
              handleInputChange(e, "clubName");
            }}
          />

          <TextField
            label="SuomiSport ID"
            fullWidth
            margin="normal"
            value={formData.suomisportId}
            onChange={(e) => {
              handleInputChange(e, "suomisportId");
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
              required
              fullWidth
              value={formData.guardiansEmail}
              error={
                formData.guardiansEmail !== undefined &&
                formData.guardiansEmail !== "" &&
                !isValidEmail(formData.guardiansEmail)
              }
              helperText={
                formData.guardiansEmail !== undefined &&
                  formData.guardiansEmail !== "" &&
                  !isValidEmail(formData.guardiansEmail)
                  ? "Please enter a valid email"
                  : ""
              }
              onChange={(e) => {
                handleInputChange(e, "guardiansEmail");
              }}
            />
          )}
          <br />
          <FormControlLabel
            label="I agree to the Terms and Condition"
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
          />

          <Box margin="auto" width="200px">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="register-button"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default RegisterForm;

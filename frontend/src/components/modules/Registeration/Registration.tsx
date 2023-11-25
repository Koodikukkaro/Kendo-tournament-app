import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import api from "api/axios";
import { type RegisterRequest } from "types/requests";
import useToast from "hooks/useToast";
import {
  doPasswordsMatch,
  isEmptyTextField,
  isValidEmail,
  isValidGuardianEmail,
  isValidPassword,
  isValidPhone,
  isValidUsername
} from "./validationHelper";
import TextField from "@mui/material/TextField";
import { type ControlFieldConfig, type TextFieldConfig } from "types/forms";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  nationality?: string;
  inNationalTeam: boolean;
  suomisportId?: string;
  clubName?: string;
  danRank?: string;
  underage: boolean;
  guardiansEmail?: string;
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
  guardiansEmail: ""
};

const textFields: Array<TextFieldConfig<RegisterFormData>> = [
  { label: "First Name", name: "firstName", type: "text", required: true },
  { label: "Last Name", name: "lastName", type: "text", required: true },
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
    validate: isValidEmail,
    helperText: "Please enter a valid email."
  },
  {
    label: "Phone Number",
    name: "phoneNumber",
    type: "text",
    required: true,
    validate: isValidPhone,
    helperText: "Please enter a valid phone number."
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    required: true,
    validate: isValidPassword,
    helperText:
      "A valid password must contain at least one letter, one number, and be 8-30 characters long."
  },
  {
    label: "Confirm Password",
    name: "passwordConfirmation",
    type: "password",
    required: true,
    validate: doPasswordsMatch,
    helperText: "The passwords dont match."
  },
  {
    label: "Username",
    name: "userName",
    type: "text",
    required: false,
    validate: isValidUsername,
    helperText:
      "Must be 4-20 characters long, start and end with a letter or number, and contain only letters, numbers, dots, or underscores with no consecutive dots or underscores."
  },
  {
    label: "Nationality",
    name: "nationality",
    type: "text",
    required: false
  },
  { label: "Dan Rank", name: "danRank", type: "text", required: false },
  { label: "Club", name: "clubName", type: "text", required: false },
  {
    label: "SuomiSport ID",
    name: "suomisportId",
    type: "text",
    required: false
  }
];

const controlFields: Array<ControlFieldConfig<RegisterFormData>> = [
  {
    label: "I'm in the national team ring",
    name: "inNationalTeam",
    required: false
  },
  { label: "I'm underage", name: "underage", required: false }
];

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isTextFieldValid = (
      field: TextFieldConfig<RegisterFormData>
    ): boolean => {
      const fieldValue = formData[field.name] as string;
      return (
        (!field.required || !isEmptyTextField(fieldValue)) &&
        (field.validate === undefined || field.validate(formData))
      );
    };

    const isControlFieldValid = (
      field: ControlFieldConfig<RegisterFormData>
    ): boolean => {
      const isSelected = formData[field.name] as boolean;
      if (
        isSelected &&
        field.name === "underage" &&
        (isEmptyTextField(formData.guardiansEmail) ||
          !isValidGuardianEmail(formData))
      ) {
        return false;
      }

      return !field.required || isSelected;
    };

    setIsFormValid(
      textFields.every(isTextFieldValid) &&
        controlFields.every(isControlFieldValid)
    );
  }, [formData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof RegisterFormData
  ): void => {
    const target = event.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const onHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const { passwordConfirmation, ...requestBody } = formData;
      await api.user.register(requestBody as RegisterRequest);
      showToast("Registration successful!", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      showToast(error, "error");
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
          {textFields.map((field) => (
            <TextField
              key={field.name}
              id={field.name}
              label={field.label}
              fullWidth
              margin="normal"
              type={field.type}
              autoComplete="off"
              required={field.required}
              value={formData[field.name]}
              onChange={(e) => {
                handleInputChange(e, field.name);
              }}
              error={
                !isEmptyTextField(formData[field.name] as string) &&
                field.validate !== undefined &&
                !field.validate(formData)
              }
              helperText={
                !isEmptyTextField(formData[field.name] as string) &&
                field.validate !== undefined &&
                !field.validate(formData) &&
                field.helperText
              }
            />
          ))}
          {controlFields.map((field) => (
            <React.Fragment key={field.name}>
              <FormControlLabel
                key={field.name}
                name={field.name}
                label={field.label}
                required={field.required}
                control={
                  <Checkbox
                    checked={formData[field.name] as boolean}
                    onChange={(e) => {
                      handleInputChange(e, field.name);
                    }}
                    name={field.name}
                  />
                }
              />
              {field.name === "underage" && formData.underage && (
                <TextField
                  label="Guardian's Email"
                  required
                  fullWidth
                  margin="normal"
                  type={"email"}
                  value={formData.guardiansEmail}
                  onChange={(e) => {
                    handleInputChange(e, "guardiansEmail");
                  }}
                  error={
                    !isEmptyTextField(formData.guardiansEmail) &&
                    !isValidGuardianEmail(formData)
                  }
                  helperText={
                    !isEmptyTextField(formData.guardiansEmail) &&
                    !isValidGuardianEmail(formData)
                      ? "Please enter a valid email."
                      : ""
                  }
                />
              )}
              <br />
            </React.Fragment>
          ))}
          <Box margin="auto" width="200px">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="register-button"
              disabled={!isFormValid}
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

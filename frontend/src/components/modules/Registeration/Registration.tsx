import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import api from "api/axios";
import { type RegisterRequest } from "types/requests";
import useToast from "hooks/useToast";
import {
  CheckboxElement,
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
  useForm,
  useWatch
} from "react-hook-form-mui";
import {
  isValidPassword,
  isValidPhone,
  isValidUsername
} from "./registerationValidators";

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
const defaultValues: RegisterFormData = {
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

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const formContext = useForm<RegisterFormData>({
    defaultValues,
    mode: "onBlur"
  });
  const { underage } = useWatch<RegisterFormData>(formContext);

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      const { passwordConfirmation, ...requestBody } = data;
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

        <FormContainer
          defaultValues={defaultValues}
          formContext={formContext}
          onSuccess={onSubmit}
        >
          <TextFieldElement
            required
            name="firstName"
            label="First Name"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="lastName"
            label="Last Name"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidPhone(value) || "Please enter a valid phone number"
                );
              }
            }}
          />

          <PasswordElement
            required
            name="password"
            label="Password"
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidPassword(value) ||
                  "A valid password must contain at least one letter, one number, and be 8-30 characters long."
                );
              }
            }}
          />

          <PasswordRepeatElement
            passwordFieldName="password"
            name="passwordConfirmation"
            label="Repeat Password"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="userName"
            label="Username"
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidUsername(value) ||
                  "Username must be 4-20 characters long, start and end with a letter or number, and contain only letters, numbers, dots, or underscores with no consecutive dots or underscores."
                );
              }
            }}
          />

          <TextFieldElement
            name="nationality"
            label="Nationality"
            fullWidth
            margin="normal"
          />

          <CheckboxElement
            name="inNationalTeam"
            label="I'm in the national team ring"
          />

          <TextFieldElement
            name="rank"
            label="Dan Rank"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="club"
            label="Club"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="suomisport"
            label="Suomisport ID"
            fullWidth
            margin="normal"
          />

          <CheckboxElement
            name="underage"
            label="I'm underage"
            onChange={(e) => {
              formContext.resetField("guardiansEmail");
              formContext.setValue("underage", e.target.checked);
            }}
          />
          {Boolean(underage) && (
            <TextFieldElement
              required
              name="guardiansEmail"
              label="Guardian's Email Address"
              type="email"
              fullWidth
              margin="normal"
            />
          )}

          <Box margin="auto" width="200px">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Grid>
  );
};

export default RegisterForm;

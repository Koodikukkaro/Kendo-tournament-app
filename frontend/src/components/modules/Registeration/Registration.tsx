import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";

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
} from "utils/form-validators";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const formContext = useForm<RegisterFormData>({
    defaultValues,
    mode: "onBlur"
  });
  const { underage } = useWatch<RegisterFormData>(formContext);

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      const { passwordConfirmation, ...requestBody } = data;
      await api.user.register(requestBody as RegisterRequest);
      showToast(t("messages.registration_success"), "success");
      navigate(routePaths.login, { replace: true });
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <Grid container display="flex" justifyContent="center">
      <Box
        sx={{
          padding: "1em",
          width: "500px"
        }}
      >
        <Box display="flex" flexDirection="column" gap="5px" width="100%">
          <Typography component="h1" variant="h5" fontWeight="bold">
            {t("titles.create_account")}
          </Typography>
          <Typography variant="body1">
            {"Already have an account? "}
            <Link component={RouterLink} to={routePaths.login}>
              {t("register_labels.sign_in")}
            </Link>
          </Typography>
          <Typography variant="body2">
            {t("register_labels.field_required_notice")}
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
            label={t("user_info_labels.first_name")}
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="lastName"
            label={t("user_info_labels.last_name")}
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="email"
            label={t("user_info_labels.email_address")}
            type="email"
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            required
            name="phoneNumber"
            label={t("user_info_labels.phone_number")}
            type="tel"
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidPhone(value) || t("messages.phonenumber_validation")
                );
              }
            }}
          />

          <PasswordElement
            required
            name="password"
            label={t("user_info_labels.password_label")}
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidPassword(value) || t("messages.password_validation")
                );
              }
            }}
          />

          <PasswordRepeatElement
            required
            passwordFieldName="password"
            name="passwordConfirmation"
            label={t("user_info_labels.repeat_password_label")}
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="userName"
            label={t("user_info_labels.username")}
            fullWidth
            margin="normal"
            validation={{
              validate: (value: string) => {
                return (
                  isValidUsername(value) || t("messages.username_validation")
                );
              }
            }}
          />

          <TextFieldElement
            name="nationality"
            label={t("user_info_labels.nationality")}
            fullWidth
            margin="normal"
          />

          <CheckboxElement
            name="inNationalTeam"
            label={t("user_info_labels.in_national_team")}
          />

          <TextFieldElement
            name="rank"
            label={t("user_info_labels.dan_rank")}
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="club"
            label={t("user_info_labels.club")}
            fullWidth
            margin="normal"
          />

          <TextFieldElement
            name="suomisport"
            label={t("user_info_labels.suomisport_id")}
            fullWidth
            margin="normal"
          />

          <CheckboxElement
            name="underage"
            label={t("user_info_labels.underage")}
            onChange={(e) => {
              formContext.resetField("guardiansEmail");
              formContext.setValue("underage", e.target.checked);
            }}
          />
          {Boolean(underage) && (
            <TextFieldElement
              required
              name="guardiansEmail"
              label={t("user_info_labels.guardians_email")}
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
              {t("buttons.register_button")}
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Grid>
  );
};

export default RegisterForm;

import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement
} from "react-hook-form-mui";

import { useNavigate } from "react-router-dom";
import useToast from "hooks/useToast";
import routePaths from "routes/route-paths";
import { useAuth } from "context/AuthContext";
import api from "api/axios";
import { isValidPassword } from "utils/form-validators";
import { useTranslation } from "react-i18next";

interface PasswordResetFormData {
  password: string;
  passwordConfirmation: string;
}

interface PasswordResetFormProps {
  resetToken: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  resetToken
}) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { t } = useTranslation();

  const onSubmit = async ({
    password
  }: PasswordResetFormData): Promise<void> => {
    try {
      await api.auth.resetPassword({ password, token: resetToken });

      const navigateTo = isAuthenticated
        ? routePaths.homeRoute
        : routePaths.login;

      showToast(t("messages.password_reset"), "success");
      navigate(navigateTo, { replace: true });
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
        <Typography component="h1" variant="h5" fontWeight="bold" mb={1}>
          {t("titles.password_change")}
        </Typography>

        <FormContainer onSuccess={onSubmit} mode="onBlur">
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
            passwordFieldName="password"
            name="passwordConfirmation"
            label={t("user_info_labels.repeat_password_label")}
            fullWidth
            margin="normal"
          />

          <Box textAlign="center">
            <Button
              type="submit"
              id="recover-password-button"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("buttons.change_password_button")}
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Grid>
  );
};

export default PasswordResetForm;

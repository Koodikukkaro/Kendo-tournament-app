import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useToast from "hooks/useToast";

import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import routePaths from "routes/route-paths";
import api from "api/axios";
import { useAuth } from "context/AuthContext";
import { useTranslation } from "react-i18next";

interface PasswordRecoveryFormData {
  email: string;
}

const PasswordRecoveryForm: React.FC = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { t } = useTranslation();

  const onSubmit = async ({
    email
  }: PasswordRecoveryFormData): Promise<void> => {
    try {
      await api.auth.recoverPassword(email);

      const navigateTo = isAuthenticated
        ? routePaths.homeRoute
        : routePaths.login;

      navigate(navigateTo, { replace: true });
      showToast(t("messages.password_recovery"), "success");
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
          {t("titles.password_recovery")}
        </Typography>

        <FormContainer onSuccess={onSubmit} mode="onBlur">
          <TextFieldElement
            required
            name="email"
            label={t("user_info_labels.email_address")}
            type="email"
            fullWidth
            margin="normal"
            helperText={t("password_recovery_form.email_helper_text")}
          />

          <Box textAlign="center">
            <Button
              type="submit"
              id="recover-password-button"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("buttons.recover_button")}
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Grid>
  );
};

export default PasswordRecoveryForm;

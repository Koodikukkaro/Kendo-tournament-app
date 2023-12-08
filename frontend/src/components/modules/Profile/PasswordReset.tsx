import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useToast from "hooks/useToast";

import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import routePaths from "routes/route-paths";
import type { PasswordResetRequest } from "types/requests";
import api from "api/axios";

const PasswordResetForm: React.FC = () => {
  const showToast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: PasswordResetRequest): Promise<void> => {
    try {
      await api.auth.resetPassword(data);
      navigate(routePaths.login, { replace: true });
      showToast(
        "Instructions to reset your password will be sent to you shortly. Please check your email.",
        "success"
      );
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
          Recover your password
        </Typography>

        <FormContainer onSuccess={onSubmit} mode="onBlur">
          <TextFieldElement
            required
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            helperText="Enter your email and we’ll send you a link to reset your password"
          />

          <Box textAlign="center">
            <Button
              type="submit"
              id="btn-retrieve-pwd"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Retrieve Password
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Grid>
  );
};

export default PasswordResetForm;

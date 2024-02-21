import React, { type ReactElement } from "react";
import {
  type SnackbarKey,
  type VariantType,
  closeSnackbar,
  useSnackbar
} from "notistack";
import Button from "@mui/material/Button";
import { isAxiosError } from "axios";
import { type ApiErrorResponse } from "types/responses";
import { useTranslation } from "react-i18next";

type ShowToastHook = (error: unknown, severity: VariantType) => void;

// A hook which can be used to show toast notifications
const useToast = (): ShowToastHook => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Add action to an individual snackbar
  const action = (snackbarId: SnackbarKey): ReactElement => (
    <Button
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
      sx={{ color: "white" }}
    >
      {t("messages.dismiss")}
    </Button>
  );

  return (error, severity): void => {
    if (isAxiosError<ApiErrorResponse>(error)) {
      const errors = error.response?.data.errors ?? [
        { message: error.message }
      ];

      errors.forEach((error) => {
        const messages =
          error.context !== undefined && Object.keys(error.context).length > 0
            ? Object.values(error.context).map(({ message }) => message)
            : [error.message];

        messages.forEach((message) => {
          enqueueSnackbar(message, { variant: severity, action });
        });
      });
    } else if (typeof error === "string") {
      enqueueSnackbar(error, { variant: severity, action });
    } else {
      // Stock error: These are unhandled errors which should not be leaked to the user.
      enqueueSnackbar(t("messages.unexpected_error"), { variant: "error" });
    }
  };
};

export default useToast;

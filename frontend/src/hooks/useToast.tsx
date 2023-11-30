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

type ShowToastHook = (error: unknown, severity: VariantType) => void;

// Add action to an individual snackbar
const action = (snackbarId: SnackbarKey): ReactElement => (
  <Button
    onClick={() => {
      closeSnackbar(snackbarId);
    }}
    sx={{ color: "white" }}
  >
    {"Dismiss"}
  </Button>
);

// A hook which can be used to show toast notifications
const useToast = (): ShowToastHook => {
  const { enqueueSnackbar } = useSnackbar();

  return (error, severity): void => {
    if (isAxiosError<ApiErrorResponse>(error)) {
      const errors = error.response?.data.errors ?? [];

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
      enqueueSnackbar("Unexpected error.", { variant: "error" });
    }
  };
};

export default useToast;

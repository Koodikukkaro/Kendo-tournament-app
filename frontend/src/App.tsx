import React, { type ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import { router } from "routes/Router";
import theme from "themes/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

const App = (): ReactElement => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        dense
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </LocalizationProvider>
);

export default App;

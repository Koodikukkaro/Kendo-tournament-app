import React, { type ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import { router } from "routes/Router";
import { SnackbarProvider } from "notistack";

const App = (): ReactElement => (
  <SnackbarProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </SnackbarProvider>
);

export default App;

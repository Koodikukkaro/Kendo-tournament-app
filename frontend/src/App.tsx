import React, { type ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import { router } from "routes/Router";

const App = (): ReactElement => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;

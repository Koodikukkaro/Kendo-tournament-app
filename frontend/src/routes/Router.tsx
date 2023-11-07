import { AuthenticationGuard } from "components/common/AuthenticationGuard";
import LoginForm from "components/modules/Login/Login";
import RegisterForm from "components/modules/Registeration/Registration";
import Landing from "components/modules/Landing/Landing";
import Layout from "layouts/Layout";
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

// const HomePage: React.FC = () => <div>Homepage component</div>;

const routes = createRoutesFromElements(
  <Route element={<Layout />}>
    <Route index element={<Landing />} />

    {/* Protect all other routes based on authentication */}
    <Route element={<AuthenticationGuard />}>
      {/* other components that require authentication... */}
    </Route>

    {/* Login page in case unauthenticated */}
    <Route
      element={
        <AuthenticationGuard
          guardType="unauthenticated"
          redirectPath="/login"
        />
      }
    >
      <Route path="login" element={<LoginForm />} />
    </Route>

    {/* Register page in case unauthenticated */}
    <Route
      element={
        <AuthenticationGuard
          guardType="unauthenticated"
          redirectPath="/register"
        />
      }
    >
      <Route path="register" element={<RegisterForm />} />
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);

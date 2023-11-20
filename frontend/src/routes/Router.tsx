import { AuthenticationGuard } from "components/common/AuthenticationGuard";
import LoginForm from "components/modules/Login/Login";
import RoundRobinTournamentView from "components/modules/OngoingTournament/RoundRobinTournamentView";
import RegisterForm from "components/modules/Registeration/Registration";
import Layout from "layouts/Main/Layout";

import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

const routes = createRoutesFromElements(
  <Route>
    {/* TODO: Different navbar/layout for the unauthenticated. */}
    {/* Unauthenticated stuff: */}
    <Route path="/" element={<Layout />}>
      <Route index element={<RoundRobinTournamentView />} />
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

    {/* Protect all other routes with authentication.
        I.e., put all stuff in here:
    */}
    <Route element={<AuthenticationGuard />}>
      <Route path="/" element={<Layout />}></Route>
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);

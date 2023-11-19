import { AuthenticationGuard } from "components/common/AuthenticationGuard";
import Landing from "components/modules/Landing/Landing";
import Layout from "layouts/Layout";
import LoginForm from "components/modules/Login/Login";
import RegisterForm from "components/modules/Registeration/Registration";
import RoundRobinTournamentView from "components/modules/OngoingTournament/RoundRobinTournamentView";
import OfficialGameInterface from "components/modules/GameInterface/OfficialGameInterface";
// import Layout from "layouts/Layout";

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
      <Route index element={<Landing />} />
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

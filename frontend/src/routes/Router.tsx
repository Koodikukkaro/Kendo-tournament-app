import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route
} from "react-router-dom";

import Layout from "layouts/Main/Layout";
import LoginForm from "components/modules/Login/Login";
import Profile from "components/modules/Profile/Profile";
import RegisterForm from "components/modules/Registeration/Registration";
import { AuthenticationGuard } from "components/common/AuthenticationGuard";
import CreateTournamentForm from "components/modules/Tournaments/CreateTournament";
import Signup from "components/modules/Tournaments/Signup/Signup";
import TournamentDetails from "components/modules/Tournaments/TournamentDetails";
import TournamentList from "components/modules/Tournaments/TournamentListing/TournamentsList";
import { TournamentsProvider } from "context/TournamentsContext";
import { TournamentProvider } from "context/TournamentContext";
import RootRoute from "./RootRoute";

export const homeRoute = "/tournaments";

const routes = createRoutesFromElements(
  <Route element={<RootRoute />}>
    <Route element={<Layout />}>
      <Route element={<AuthenticationGuard guardType="unauthenticated" />}>
        <Route path="/tournaments" element={<TournamentsProvider />}>
          <Route index element={<TournamentList />} />

          <Route path=":id" element={<TournamentProvider />}>
            <Route index element={<TournamentDetails />} />
            <Route
              path="sign-up"
              element={
                <AuthenticationGuard>
                  <Signup />
                </AuthenticationGuard>
              }
            />
          </Route>
        </Route>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        {/* Redirect from other routes */}
        <Route path="*" element={<Navigate to={"/tournaments"} replace />} />
      </Route>

      <Route element={<AuthenticationGuard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="new-tournament" element={<CreateTournamentForm />} />
      </Route>
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);

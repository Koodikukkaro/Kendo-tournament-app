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
import GameInterface from "components/modules/GameInterface/GameInterface";
import { SocketProvider } from "context/SocketContext";

export const homeRoute = "/tournaments";

const routes = createRoutesFromElements(
  <Route element={<RootRoute />}>
    <Route element={<Layout />}>
      <Route path="/tournaments" element={<TournamentsProvider />}>
        <Route index element={<TournamentList />} />

        <Route element={<AuthenticationGuard />}>
          <Route path="new-tournament" element={<CreateTournamentForm />} />
        </Route>

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

      <Route element={<SocketProvider />}>
        <Route
          path="/tournaments/:id/matches/:id"
          element={<GameInterface />}
        ></Route>
      </Route>

      <Route element={<AuthenticationGuard guardType="unauthenticated" />}>
        <Route path="login" element={<LoginForm />} />
      </Route>

      <Route element={<AuthenticationGuard guardType="unauthenticated" />}>
        <Route path="register" element={<RegisterForm />} />
      </Route>

      <Route element={<AuthenticationGuard />}>
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Redirect from other routes */}
      <Route path="*" element={<Navigate to={"/tournaments"} replace />} />
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);

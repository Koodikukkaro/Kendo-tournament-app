import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import routePaths from "routes/route-paths";

export type ProtectedRouteProps = { children?: React.ReactElement } & {
  isAllowed: boolean;
  redirectPath?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  children,
  redirectPath = routePaths.homeRoute
}) => {
  const location = useLocation();

  const isCurrentRouteRedirect = location.pathname === redirectPath;

  if (!isAllowed && !isCurrentRouteRedirect) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Children is used when the ProtectedRoute is not used as Layout component
  return children ?? <Outlet />;
};

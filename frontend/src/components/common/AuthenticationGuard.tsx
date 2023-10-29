import React from "react";
import { useAuth } from "context/AuthContext";
import { ProtectedRoute } from "routes/ProtectedRoute";

export interface AuthenticationGuardProps {
  children?: React.ReactElement;
  redirectPath?: string;
  guardType?: "authenticated" | "unauthenticated";
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  redirectPath = "/login",
  guardType = "authenticated",
  ...props
}) => {
  const { user } = useAuth();

  const isAllowed = guardType === "authenticated" && user !== null;

  return (
    <ProtectedRoute
      redirectPath={redirectPath}
      isAllowed={isAllowed}
      {...props}
    />
  );
};

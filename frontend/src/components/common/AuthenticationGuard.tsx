import React from "react";
import { useAuth } from "context/AuthContext";
import { ProtectedRoute } from "routes/ProtectedRoute";

export interface AuthenticationGuardProps {
  guardType?: "authenticated" | "unauthenticated";
  redirectPath?: string;
  children?: React.ReactElement;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  guardType = "authenticated",
  redirectPath,
  ...props
}) => {
  const { isAuthenticated } = useAuth();

  const isAllowed =
    (guardType === "authenticated" && isAuthenticated) ||
    (guardType === "unauthenticated" && !isAuthenticated);

  return (
    <ProtectedRoute
      redirectPath={redirectPath ?? (isAuthenticated ? "/" : "/login")}
      isAllowed={isAllowed}
      {...props}
    />
  );
};

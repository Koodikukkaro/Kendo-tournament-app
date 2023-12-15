import InterceptorSetup from "api/axiosInterceptor";
import React, { type ReactElement } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

const RootRoute: React.FC = (): ReactElement => {
  return (
    <React.Fragment>
      <InterceptorSetup />
      <ScrollRestoration />
      <Outlet />
    </React.Fragment>
  );
};

export default RootRoute;

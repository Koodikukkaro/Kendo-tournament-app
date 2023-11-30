import InterceptorSetup from "api/axiosInterceptor";
import React, { type ReactElement } from "react";
import { Outlet } from "react-router-dom";

const Root: React.FC = (): ReactElement => {
  return (
    <React.Fragment>
      <InterceptorSetup />
      <Outlet />
    </React.Fragment>
  );
};

export default Root;

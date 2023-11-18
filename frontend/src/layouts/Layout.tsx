import React, { type ReactElement } from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "./NavigationBar/NavigationBar";

// TODO: Implement proper layouts.
const Layout = (): ReactElement => {
  return (
    <div>
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default Layout;

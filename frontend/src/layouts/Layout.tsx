import React, { type ReactElement } from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "../components/common/layout-components/NavigationBar/NavigationBar";
import { navigationItems, settings } from "../navigation-data";

// TODO: Implement proper layouts.
const Layout = (): ReactElement => {
  return (
    <div>
      <NavigationBar navigationItems={navigationItems} settings={settings} />
      <Outlet />
    </div>
  );
};

export default Layout;

import Footer from "layouts/Footer/Footer";
import NavigationBar from "layouts/NavigationBar/NavigationBar";
import {
  navigationItems,
  settings
} from "layouts/NavigationBar/navigation-data";
import React, { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = (): ReactElement => {
  return (
    <div className="app-wrapper">
      <NavigationBar navigationItems={navigationItems} settings={settings} />
      <div className="app-container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

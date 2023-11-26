import Footer from "layouts/Footer/Footer";
import NavigationBar from "layouts/NavigationBar/NavigationBar";
import {
  authenticatedNavItems,
  unAuthenticatedNavItems,
  settings
} from "layouts/NavigationBar/navigation-data";
import React, { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import { useAuth } from "context/AuthContext";

const Layout = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app-wrapper">
      <NavigationBar
        navigationItems={
          isAuthenticated ? authenticatedNavItems : unAuthenticatedNavItems
        }
        settings={settings}
      />
      <div className="app-container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

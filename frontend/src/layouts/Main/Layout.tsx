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
import InterceptorSetup from "api/axiosInterceptor";
import Container from "@mui/material/Container";

const Layout = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app-wrapper">
      {/* Initialize axios interceptors here (dont know where else to put it...) */}
      <InterceptorSetup />

      <NavigationBar
        navigationItems={
          isAuthenticated ? authenticatedNavItems : unAuthenticatedNavItems
        }
        settings={settings}
      />
      <Container className="app-container">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;

import Footer from "layouts/Footer/Footer";
import NavigationBar from "layouts/NavigationBar/NavigationBar";
import {
  authenticatedNavItems,
  unAuthenticatedNavItems,
  settings
} from "layouts/NavigationBar/navigation-data";
import React, { type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";
import { useAuth } from "context/AuthContext";
import Container from "@mui/material/Container";
import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { homeRoute } from "routes/Router";

const Layout = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  return (
    <div className="app-wrapper">
      <NavigationBar
        navigationItems={
          isAuthenticated ? authenticatedNavItems : unAuthenticatedNavItems
        }
        settings={settings}
      />
      <Container className="app-container">
        {pathname !== homeRoute && (
          <Button
            id="back-button"
            onClick={() => navigate(-1)}
            sx={{ display: "flex", gap: "5px", marginBottom: "6px" }}
          >
            <ArrowBack />
            <Typography>Back</Typography>
          </Button>
        )}
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;

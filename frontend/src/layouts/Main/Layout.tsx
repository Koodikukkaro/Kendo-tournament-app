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
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

const Layout = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigationItems = isAuthenticated
    ? authenticatedNavItems
    : unAuthenticatedNavItems;

  const translantedSettings = settings.map((item) => ({
    ...item,
    text: t(item.text)
  }));

  const translantedNavItems = navigationItems.map((item) => ({
    ...item,
    text: t(item.text)
  }));

  return (
    <div className="app-wrapper">
      <NavigationBar
        navigationItems={translantedNavItems}
        settings={translantedSettings}
      />
      <Container className="app-container">
        {pathname !== routePaths.homeRoute && (
          <Button
            id="back-button"
            onClick={() => {
              navigate(-1);
            }}
            sx={{ display: "flex", gap: "5px", marginBottom: "6px" }}
          >
            <ArrowBack />
            <Typography>{t("navigation.back")}</Typography>
          </Button>
        )}
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;

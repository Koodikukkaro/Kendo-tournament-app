/*
  Much of the code comes from the corresponding MUI examples that are MIT licensed.
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/DrawerAppBar.tsx
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/ResponsiveAppBar.tsx
*/
import React from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import LanguageSwitcher from "./LanguageSwitcher";

import MenuIcon from "@mui/icons-material/Menu";

import NavigationDrawer from "./NavigationDrawer";
import NavigationUserMenu from "./NavigationUserMenu";
import LogoButton from "./LogoButton";
// Text to display in the hamburger menu, navbar and the corresponding link
// -,- in the menu and the corresponding link

import type { NavigationData, NavigationItem } from "./navigation-bar";
import routePaths from "routes/route-paths";
import { useAuth } from "context/AuthContext";

interface Props {
  window?: () => Window;
  settings: NavigationData;
  navigationItems: NavigationData;
}

const APP_NAME = "KendoApp";

const NavigationBar: React.FC<Props> = (props) => {
  const { window, navigationItems } = props;
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const toggleDrawer = (): void => {
    setOpenDrawer((previousState) => !previousState);
  };

  const handleButtonClick = async (
    navigationItem: NavigationItem
  ): Promise<void> => {
    if (navigationItem.link === routePaths.logout) {
      await logout();
    }

    navigate(navigationItem.link);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="static" component="nav">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Hamburger menu icon */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <LanguageSwitcher />
              {/* Navigation bar links */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    sx={{ color: "#fff" }}
                    onClick={async () => {
                      await handleButtonClick(item);
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
              <LogoButton logoName={APP_NAME} />
              {isAuthenticated ? (
                <NavigationUserMenu settings={props.settings} />
              ) : null}
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      {/* Actual hamburger menu */}
      <NavigationDrawer
        container={container}
        toggleDrawer={toggleDrawer}
        drawerIsOpen={openDrawer}
        navigationItems={navigationItems}
        drawerTitle={APP_NAME}
      />
    </>
  );
};

export default NavigationBar;

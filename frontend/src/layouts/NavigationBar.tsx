/*
  Much of the code comes from the corresponding MUI examples that are MIT licensed.
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/DrawerAppBar.tsx
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/ResponsiveAppBar.tsx
*/

import Container from "@mui/material/Container";

import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import NavigationDrawer from "./NavigationDrawer";
// Text to display and the corresponding link
import { navigationItems, settings } from "./navigationdata";

interface Props {
  window?: () => Window;
}

const NavigationBar: React.FC<Props> = (props) => {
  const { window } = props;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const toggleDrawer = (): void => {
    setOpenDrawer((previousState) => !previousState);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
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
              {/* Navigation bar links */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    sx={{ color: "#fff" }}
                    component={NavLink}
                    to={item.link}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
              {/*
                TODO: Add the logo of the app.
              */}
              {/* User profile settings icon */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="user avatar" /* src="avatarimagefilepath" */
                      sx={{ width: 30, height: 30 }}
                    >
                      <AccountCircle sx={{ width: 30, height: 30 }} />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                {/* User profile settings menu */}
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.text}
                      onClick={handleCloseUserMenu}
                      component={NavLink}
                      to={setting.link}
                    >
                      {setting.text}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {/* Actual hamburger menu */}
      </Box>
      <NavigationDrawer
        container={container}
        toggleDrawer={toggleDrawer}
        drawerIsOpen={openDrawer}
        navigationItems={navigationItems}
        drawerTitle={"KendoApp"}
      />
      <Outlet />
    </>
  );
};

export default NavigationBar;

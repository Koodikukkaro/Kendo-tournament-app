/*
  Much of the code comes from the corresponding MUI examples that are MIT licensed.
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/DrawerAppBar.tsx
  https://github.com/mui/material-ui/blob/v5.14.18/docs/data/material/components/app-bar/ResponsiveAppBar.tsx
*/

import Container from "@mui/material/Container";

import React, { type ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  window?: () => Window;
}

// Text to display and the corresponding link
const navItems = [
  ["Login", "/login"],
  ["Register", "/register"],
  ["Landing", "/"]
];
const settings = [
  ["Profile", "/"],
  ["Logout", "/"]
];

const NavigationBar = (props: Props): ReactElement => {
  const { window } = props;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (): void => {
    setOpenDrawer((previousState) => !previousState);
  };

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ textAlign: "center" }}>
      KendoApp
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item[0]} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={NavLink}
              to={item[1]}
            >
              <ListItemText primary={item[0]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
                {navItems.map((item) => (
                  <Button
                    key={item[0]}
                    sx={{ color: "#fff" }}
                    component={NavLink}
                    to={item[1]}
                  >
                    {item[0]}
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
                      key={setting[0]}
                      onClick={handleCloseUserMenu}
                      component={NavLink}
                      to={setting[1]}
                    >
                      {setting[0]}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {/* Actual hamburger menu */}
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={openDrawer}
            onClose={toggleDrawer}
            ModalProps={{
              // Better open performance on mobile.
              keepMounted: true
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240
              }
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
      <Outlet />
    </>
  );
};

export default NavigationBar;

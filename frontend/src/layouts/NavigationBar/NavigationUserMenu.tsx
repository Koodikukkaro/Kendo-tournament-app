/*
  This component implements the user profile pic part of the navbar and
  the menu that will open when clicked.
  See the MUI example for responsive navbar with menu.
*/
import React from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import AccountCircle from "@mui/icons-material/AccountCircle";

import type { NavigationItem, NavigationData } from "./navigation-bar";
import { useAuth } from "context/AuthContext";
import { useTranslation } from "react-i18next";

interface Props {
  settings: NavigationData;
}

const NavigationUserMenu: React.FC<Props> = (props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleButtonClick = async (
    navigationItem: NavigationItem
  ): Promise<void> => {
    setAnchorElUser(null);
    if (navigationItem.text === t("navigation.logout")) {
      await logout();
    }

    navigate(navigationItem.link);
  };

  return (
    <>
      {/* User profile settings icon */}
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title={t("navigation.openSettingsTooltip")}>
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
          onClose={() => {
            setAnchorElUser(null);
          }}
        >
          {props.settings.map((setting: NavigationItem) => (
            <MenuItem
              key={setting.text}
              onClick={async () => {
                await handleButtonClick(setting);
              }}
            >
              {setting.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default NavigationUserMenu;

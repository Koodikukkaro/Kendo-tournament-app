// See MUI Drawer Navbar example
import React from "react";
import { NavLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import type { NavigationItem, NavigationData } from "./navigation-bar.d.ts";

interface Props {
  container: (() => HTMLElement) | undefined;
  // Sets drawerIsOpen:
  toggleDrawer: () => void;
  drawerIsOpen: boolean;
  navigationItems: NavigationData;
  drawerTitle: string;
}

const NavigationDrawer: React.FC<Props> = (props) => {
  const { toggleDrawer, drawerIsOpen, container, navigationItems } = props;
  const drawer = (
    <Box onClick={toggleDrawer} sx={{ textAlign: "center" }}>
      {props.drawerTitle}
      <Divider />
      <List>
        {navigationItems.map((item: NavigationItem) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={NavLink}
              to={item.link}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <nav>
      <Drawer
        container={container}
        variant="temporary"
        open={drawerIsOpen}
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
  );
};

export default NavigationDrawer;

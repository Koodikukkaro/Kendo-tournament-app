import React, { type ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";
// import { Link, Outlet } from "react-router-dom";

// // TODO: Implement proper layouts.

// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// import Link from "@mui/material/Link";
// import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import Link from "@mui/material/Link";

const NavigationBar = (/* { user: } */): ReactElement => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={NavLink} to="">
            home
          </Button>
          <Button color="inherit">notes</Button>
          <Button color="inherit">users</Button>
          {/* user ? (
            <em>{user} logged in</em>
          ) : (
            <Button color="inherit">login</Button>
          ) */}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

// import { NavLink, Outlet } from "react-router-dom";
// // TODO: Add desired NavLinks
// const NavigationBar = (): ReactElement => {
//   return (
//     <>
//       <nav>
//         <ul>
//           <li>
//             <NavLink to="">NavMessage</NavLink>
//           </li>
//           <li>
//             <NavLink to="">Navigointia</NavLink>
//           </li>
//         </ul>
//       </nav>
//       <Outlet />
//     </>
//   );
// };

export default NavigationBar;

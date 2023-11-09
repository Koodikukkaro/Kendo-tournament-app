// import React, { type ReactElement } from "react";
// import { Link, Outlet } from "react-router-dom";

// // TODO: Implement proper layouts.
// const Layout = (): ReactElement => {
//   return (
//     <div>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/login">Login</Link>
//           </li>
//         </ul>
//       </nav>
//       <Outlet />
//     </div>
//   );
// };

// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// import Link from "@mui/material/Link";
// import Typography from "@mui/material/Typography";

import React, { type ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";
const NavigationBar = (): ReactElement => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="">NavMessage</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default NavigationBar;

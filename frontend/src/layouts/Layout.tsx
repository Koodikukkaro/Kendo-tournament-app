import React, { type ReactElement } from "react";
import { Link, Outlet } from "react-router-dom";

// TODO: Implement proper layouts.
const Layout = (): ReactElement => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;

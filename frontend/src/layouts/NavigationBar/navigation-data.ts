/*
  This data is used when displaying a text and a corresponding URL to move to.
  It's used in navbar, but it's probably of general importance.
*/

import { type NavigationData } from "./navigation-bar";
import routePaths from "routes/route-paths";

// Text to display and the corresponding link

export const baseNavItems: NavigationData = [
  {
    text: "Home",
    link: routePaths.homeRoute
  }
];

export const signupData: NavigationData = [
  {
    text: "Login",
    link: routePaths.login
  },
  {
    text: "Register",
    link: routePaths.register
  }
];

export const unAuthenticatedNavItems: NavigationData =
  baseNavItems.concat(signupData);

export const authenticatedNavItems: NavigationData = baseNavItems.concat([
  {
    text: "Profile",
    link: routePaths.profile
  },
  {
    text: "Tournaments",
    link: routePaths.tournaments
  }
]);

export const settings: NavigationData = [
  {
    text: "Profile",
    link: routePaths.profile
  },
  {
    text: "Logout",
    link: routePaths.logout
  }
];

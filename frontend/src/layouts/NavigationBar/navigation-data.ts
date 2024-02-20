/*
  This data is used when displaying a text and a corresponding URL to move to.
  It's used in navbar, but it's probably of general importance.
*/

import { type NavigationData } from "./navigation-bar";
import routePaths from "routes/route-paths";

// Text to display and the corresponding link

export const baseNavItems: NavigationData = [
  {
    text: "navigation.home",
    link: routePaths.homeRoute
  }
];

export const signupData: NavigationData = [
  {
    text: "navigation.login",
    link: routePaths.login
  },
  {
    text: "navigation.register",
    link: routePaths.register
  }
];

export const unAuthenticatedNavItems: NavigationData =
  baseNavItems.concat(signupData);

export const authenticatedNavItems: NavigationData = baseNavItems.concat([
  {
    text: "navigation.profile",
    link: routePaths.profile
  }
]);

export const settings: NavigationData = [
  {
    text: "navigation.profile",
    link: routePaths.profile
  },
  {
    text: "navigation.logout",
    link: routePaths.logout
  }
];

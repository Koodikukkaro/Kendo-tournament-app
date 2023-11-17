/*
  This data is used when displaying a text and a corresponding URL to move to
*/
import { type NavigationData } from "./NavigationDrawer";

// Text to display and the corresponding link
export const navigationItems: NavigationData = [
  {
    text: "Login",
    link: "/login"
  },
  {
    text: "Register",
    link: "/register"
  },
  {
    text: "Landing",
    link: "/"
  }
];
export const settings: NavigationData = [
  {
    text: "Profile",
    link: "/"
  },
  {
    text: "Logout",
    link: "/"
  }
];

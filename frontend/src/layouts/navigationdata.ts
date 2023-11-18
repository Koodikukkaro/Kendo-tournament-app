/*
  This data is used when displaying a text and a corresponding URL to move to.
  It's used in navbar, but it's probably of general importance.
*/
export interface NavigationItem {
  text: string;
  link: string;
}
export type NavigationData = NavigationItem[];

// Text to display and the corresponding link
export const navigationItems: NavigationData = [
  {
    text: "Login",
    link: "/login"
  },
  {
    text: "Register",
    link: "/register"
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

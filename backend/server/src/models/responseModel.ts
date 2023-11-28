import type { User } from "./userModel";

export interface LoginResponseInternal {
  user: User;
  accessToken: string;
  refreshToken: string;
}

import type { User } from "./userModel";

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

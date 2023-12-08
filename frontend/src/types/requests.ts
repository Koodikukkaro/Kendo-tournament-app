import type { Tournament, User } from "./models";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  suomisportId?: string;
  inNationalTeam: boolean;
  clubName?: string;
  danRank?: string;
  underage: boolean;
  guardiansEmail?: string;
}

export type CreateTournamentRequest = Omit<
  Tournament,
  "id" | "creator" | "matchSchedule" | "players"
>;

export interface SignupForTournamentRequest {
  playerId: string;
}

export type EditUserRequest = Omit<User, "password" | "id">;

export interface PasswordRecoveryRequest {
  email: string;
}

import type { Tournament, PointType, PlayerColor } from "./models";

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

export interface AddPointRequest {
  pointType: PointType;
  pointColor: PlayerColor;
  comment?: string;
}

export type EditUserRequest = Omit<RegisterRequest, "password">;

export type ResetPasswordRequest = Pick<RegisterRequest, "password"> & {
  token: string;
};

import type { MatchType, PlayerColor, PointType } from "./matchModel.js";
import type { Tournament } from "./tournamentModel.js";

/**
 * MongoDB Object ID.
 * Represents a 24-character hexadecimal string.
 * Used for the purpose of identifying and handling invalid ID query parameters prior to initiating queries.
 * @pattern ^[0-9a-fA-F]{24}$
 * @format objectId
 */
export type ObjectIdString = string;

export interface RegisterRequest {
  /**
   * @example "john.doe@gmail.com"
   * @pattern ^[a-zA-Z0-9._%+-åäöÅÄÖ]+@[a-zA-Z0-9.-åäöÅÄÖ]+\.[a-zA-ZåäöÅÄÖ]{2,}$ Email format invalid.
   */
  email: string;
  /**
   * @example "Foobar123"
   * @pattern ^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$ Password format invalid. Must contain at least one letter, one number, and be 8-30 characters long.
   */
  password: string;
  /**
   * @example "KendoMaster123"
   * @pattern ^$|^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._åäöÅÄÖ]+(?<![_.])$ Username invalid. Must be 4-20 characters long, start and end with a letter or number, and contain only letters, numbers, dots, or underscores with no consecutive dots or underscores.
   */
  userName?: string;
  /**
   * @example "0401234567"
   * @pattern ^[0-9]{10,15}$ Phone number format invalid.
   */
  phoneNumber: string;
  /**
   * @example "John"
   */
  firstName: string;
  /**
   * @example "Doe"
   */
  lastName: string;
  /**
   * @example "FIN"
   */
  nationality?: string;
  /**
   * @example "sportId123"
   */
  suomisportId?: string;
  inNationalTeam: boolean;
  /**
   * @example "Seinäjoki Kendo club"
   */
  clubName?: string;
  /**
   * @example "someRank"
   */
  danRank?: string;
  underage: boolean;
  /**
   * @example "guardian@gmail.com"
   * @pattern ^$|^[a-zA-Z0-9._%+-åäöÅÄÖ]+@[a-zA-Z0-9.-åäöÅÄÖ]+\.[a-zA-ZåäöÅÄÖ]{2,}$ Guardians email format invalid.
   */
  guardiansEmail?: string;
}

export interface LoginRequest {
  /**
   * @example "john.doe@gmail.com"
   */
  email: string;
  /**
   * @example "Foobar123"
   */
  password: string;
}

interface MatchPlayerPayload {
  id: ObjectIdString;
  color: PlayerColor;
}

export interface CreateMatchRequest {
  /**
   * @minItems 2 Two players are required
   * @maxItems 2 Two players are required
   */
  players: MatchPlayerPayload[];
  tournamentId: ObjectIdString;
  officials?: ObjectIdString[];
  matchType: MatchType;
  comment?: string;
  timeKeeper?: ObjectIdString;
  pointMaker?: ObjectIdString;
}

export interface AddPointRequest {
  pointType: PointType;
  pointColor: PlayerColor;
  comment?: string;
}

export type CreateTournamentRequest = Pick<
  Tournament,
  | "name"
  | "location"
  | "startDate"
  | "endDate"
  | "type"
  | "maxPlayers"
  | "organizerEmail"
  | "organizerPhone"
  | "description"
> & {
  differentOrganizer: boolean;
};

export interface SignupForTournamentRequest {
  playerId: ObjectIdString;
}

/* Note that we get the data validations from the registerRequest interface also */
export type EditUserRequest = Omit<RegisterRequest, "password">;

export type ResetPasswordRequest = Pick<RegisterRequest, "password"> & {
  token: string;
};

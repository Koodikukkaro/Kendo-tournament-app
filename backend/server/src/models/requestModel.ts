import type { MatchType, PlayerColor, PointType } from "./matchModel.js";

/**
 * MongoDB Object ID.
 * Represents a 24-character hexadecimal string.
 * Used for the purpose of identifying and handling invalid ID query parameters prior to initiating queries.
 * @pattern ^[0-9a-fA-F]{24}$
 * @format objectId
 */
export type ObjectIdString = string;

export enum UserRole {
  None,
  Player,
  Official,
  Admin
}

export interface RegisterRequest {
  /**
   * @example "john.doe@gmail.com"
   * @pattern ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ email format invalid
   */
  email: string;
  /**
   * @example "Foobar123"
   * @pattern ^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$ password format invalid
   */
  password: string;
  /**
   * Usernames pattern:
   *  - 4-20 characters long
   *  - no _ or . at the beginning
   *  - no __ or _. or ._ or .. inside
   *  - allowed characters [a-zA-Z0-9._]
   *  - no _ or . at the end
   * @example "KendoMaster123"
   * @pattern ^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._åäöÅÄÖ]+(?<![_.])$
   */
  userName?: string;
  /**
   * @example "0401234567"
   * @pattern ^[0-9]{10,15}$ phone number format invalid
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
   * @example "FIN
   */
  nationality: string;
  inNationalTeam: boolean;
  /**
   * @example "Seinäjoki Kendo club"
   */
  clubName: string;
  /**
   * @example "someRank"
   */
  danRank: string;
  underage: boolean;
  /**
   * @example "guardian@gmail.com"
   * @pattern ^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ email format invalid
   */
  guardiansEmail?: string;

  /**
   * Admin role
   * @example 3
   */
  role: UserRole;
}

export interface LoginRequest {
  /**
   * @example "john.doe@gmail.com"
   * @pattern ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ email format invalid
   */
  email: string;
  /**
   * @example "Foobar123"
   * @pattern ^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$ password format invalid
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
  matchType: MatchType;
  comment?: string;
}

export interface AddPointRequest {
  pointType: PointType;
  pointColor: PlayerColor;
  comment?: string;
}

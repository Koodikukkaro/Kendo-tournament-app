export interface User {
  id: string;
  email: string;
  password: string;
  userName?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  nationality: string;
  inNationalTeam: boolean;
  suomisportId: string;
  clubName: string;
  danRank: string;
  underage: boolean;
  guardiansEmail?: string;
}

export type PlayerColor = "red" | "white";

export type PointType = "men" | "kote" | "do" | "tsuki" | "hansoku";

export type MatchType = "group" | "playoff";

export interface MatchPoint {
  type: PointType;
  timestamp: Date;
}

export interface MatchPlayer {
  id: string;
  points: MatchPoint[];
  color: PlayerColor;
}
export interface Match {
  id: string;
  startTimestamp?: Date;
  timerStartedTimestamp: Date | null;
  elapsedTime: number;
  endTimestamp?: Date;
  type: MatchType;
  players: MatchPlayer[];
  winner?: string;
  comment?: string;
  tournamentId: string;
  officials: string[];
  tournamentRound: number;
  timeKeeper?: string;
  pointMaker?: string;
  isTimerOn: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: TournamentType;
  maxPlayers: number;
  creator: string;
  organizerEmail?: string;
  organizerPhone?: string;
  players: User[];
  matchSchedule: Match[];
}

export type TournamentType = "Round Robin" | "Playoff" | "Preliminary Playoff";

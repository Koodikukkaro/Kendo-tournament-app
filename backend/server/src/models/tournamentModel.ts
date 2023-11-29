import mongoose, { Schema, type Document, type Types } from "mongoose";
import { type MatchPlayer, type Match } from "./matchModel";

export enum TournamentType {
  RoundRobin = "Round Robin",
  Playoff = "Playoff",
  PreliminiaryPlayoff = "Preliminary Playoff"
}

export interface UnsavedMatch {
  players: MatchPlayer[];
  type: string;
  admin: Types.ObjectId | null;
  elapsedTime: number;
  timerStartedTimestamp: Date | null;
}

interface PlayerDetails {
  firstName: string | null;
  lastName: string | null;
  id: string | null;
}

export interface ExtendedMatch extends Match {
  playersDetails: Array<{
    id: string | null;
    firstName: string | null;
    lastName: string | null;
  }>;
  winnerDetails?: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface Tournament {
  tournamentName: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  tournamentType: TournamentType;
  organizerEmail?: string;
  organizerPhone?: string;
  maxPlayers: number;
  players: Types.ObjectId[]; // Array of player identifiers (userID from user objects)
  playerDetails?: PlayerDetails[];
  matchSchedule: Types.ObjectId[]; // Array of MatchModel (matches created in srevice)
  matchScheduleDetails?: ExtendedMatch[];
}

export interface AddPlayerRequest {
  playerId: Types.ObjectId;
}

const tournamentSchema = new Schema<Tournament & Document>(
  {
    tournamentName: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    tournamentType: {
      type: String,
      enum: Object.values(TournamentType),
      required: true
    },
    maxPlayers: { type: Number, required: true },
    players: [{ type: String }],
    matchSchedule: [{ type: String }], // Reference to Match documents
    organizerEmail: { type: String },
    organizerPhone: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals in toJSON
    toObject: { virtuals: true } // Enable virtuals in toObject
  }
);

export const TournamentModel = mongoose.model<Tournament & Document>(
  "Tournament",
  tournamentSchema
);

import mongoose, { Schema, type Document, Types } from "mongoose";
import { type MatchPlayer } from "./matchModel";

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
  tournamentRound?: number;
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
  players: Types.ObjectId[];
  matchSchedule: Types.ObjectId[];
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
    players: [{ type: Types.ObjectId, ref: 'User' }],
    matchSchedule: [{ type: Types.ObjectId, ref: 'Match' }], // Reference to Match documents
    organizerEmail: { type: String },
    organizerPhone: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const TournamentModel = mongoose.model<Tournament & Document>(
  "Tournament",
  tournamentSchema
);

import mongoose, { Schema, type Document, type Types } from "mongoose";
import { type Match } from "./matchModel";

export enum TournamentType {
  RoundRobin = "Round Robin",
  Playoff = "Playoff",
  PreliminiaryPlayoff = "Preliminary Playoff"
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
  matchSchedule: Match[];
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
    matchSchedule: [{ type: Schema.Types.ObjectId, ref: "Match" }], // Reference to Match documents
    organizerEmail: { type: String },
    organizerPhone: { type: String }
  },
  {
    timestamps: true
  }
);

export const TournamentModel = mongoose.model<Tournament & Document>(
  "Tournament",
  tournamentSchema
);

import mongoose, { Schema, type Document, Types } from "mongoose";
import { MatchPlayer } from "./matchModel";
import { type User } from "./userModel";
import type { ObjectIdString } from "./requestModel";

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
  id: Types.ObjectId;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: TournamentType;
  creator: Types.ObjectId | User;
  organizerEmail?: string;
  organizerPhone?: string;
  maxPlayers: number;
  players: Types.ObjectId[];
  matchSchedule: Types.ObjectId[];
}

export interface SignupForTournamentRequest {
  playerId: ObjectIdString;
}

const tournamentSchema = new Schema<Tournament & Document>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TournamentType),
      required: true
    },
    maxPlayers: { type: Number, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    players: [{ type: Types.ObjectId, ref: "User" }],
    matchSchedule: [{ type: Types.ObjectId, ref: "Match" }], // Reference to Match documents
    organizerEmail: { type: String },
    organizerPhone: { type: String }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret, _options) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

export const TournamentModel = mongoose.model<Tournament & Document>(
  "Tournament",
  tournamentSchema
);

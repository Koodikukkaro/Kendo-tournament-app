import mongoose, { Schema, type Document, type Types } from "mongoose";
import type { Match } from "./matchModel";
import { type User } from "./userModel";

export enum TournamentType {
  RoundRobin = "Round Robin",
  Playoff = "Playoff",
  PreliminiaryPlayoff = "Preliminary Playoff"
}

export type UnsavedMatch = Pick<
  Match,
  | "players"
  | "type"
  | "elapsedTime"
  | "timerStartedTimestamp"
  | "tournamentRound"
  | "tournamentId"
>;

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
  groups: Array<Array<Types.ObjectId>>;
  playersToPlayoffsPerGroup: number;
  groupsSizePreference: number;
  players: Array<Types.ObjectId | User>;
  matchSchedule: Array<Types.ObjectId | Match>;
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
    players: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    matchSchedule: [{ type: Schema.Types.ObjectId, ref: "Match", default: [] }],
    groups: {
      type: [[{ type: Schema.Types.ObjectId, default: [] }]],
      default: []
    },
    groupsSizePreference: { type: Number },
    playersToPlayoffsPerGroup: { type: Number },
    maxPlayers: { type: Number, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
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

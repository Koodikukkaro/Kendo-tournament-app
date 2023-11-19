import mongoose, { Schema, type Document } from "mongoose";

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

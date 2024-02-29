import mongoose, { Schema, type Types } from "mongoose";
import type { Tournament } from "./tournamentModel";

export type PlayerColor = "red" | "white";
export type PointType = "men" | "kote" | "do" | "tsuki" | "hansoku";
export type MatchType = "group" | "playoff";

export interface MatchPoint {
  type: PointType;
  timestamp: Date;
}

export interface MatchPlayer {
  id: Types.ObjectId;
  points: MatchPoint[];
  color: PlayerColor;
}

export interface Match {
  id: Types.ObjectId;
  startTimestamp?: Date;
  timerStartedTimestamp: Date | null;
  elapsedTime: number;
  endTimestamp?: Date;
  type: MatchType;
  players: Array<Types.ObjectId | MatchPlayer>;
  winner?: Types.ObjectId;
  comment?: string;
  tournamentId: Types.ObjectId | Tournament;
  officials: Types.ObjectId[];
  tournamentRound: number;
  timeKeeper?: Types.ObjectId;
  pointMaker?: Types.ObjectId;
  isTimerOn: boolean;
  player1Score: number;
  player2Score: number;
}

const pointSchema = new Schema<MatchPoint>(
  {
    type: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  { _id: false }
);

const playerSchema = new Schema<MatchPlayer>(
  {
    points: {
      type: [pointSchema],
      required: true,
      default: []
    },
    color: { type: String, required: true }
  },
  {
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

const matchSchema = new Schema<Match>(
  {
    startTimestamp: { type: Date, required: false },
    timerStartedTimestamp: { type: Date, required: false, default: null },
    elapsedTime: { type: Number, required: true, default: 0 },
    endTimestamp: { type: Date, required: false },
    type: { type: String, required: true },
    winner: { type: Schema.Types.ObjectId, required: false },
    players: {
      type: [playerSchema],
      required: true
    },
    comment: { type: String, required: false },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament"
    },
    officials: {
      type: [Schema.Types.ObjectId],
      default: []
    },
    tournamentRound: {
      type: Number,
      default: 1
    },
    timeKeeper: { type: Schema.Types.ObjectId, required: false },
    pointMaker: { type: Schema.Types.ObjectId, required: false },
    isTimerOn: { type: Boolean, required: true, default: false },
    player1Score: { type: Number, required: true, default: 0 },
    player2Score: { type: Number, required: true, default: 0 }
  },
  {
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

const MatchModel = mongoose.model("Match", matchSchema);

export default MatchModel;

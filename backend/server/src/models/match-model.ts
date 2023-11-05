import mongoose, { Schema, type Types } from "mongoose";

type MatchColor = "red" | "white";

interface MatchPoint {
  type: string;
  timestamp: Date;
}

export interface MatchPlayer {
  userId: Types.ObjectId;
  points: Types.Array<MatchPoint>;
  color: MatchColor;
}

export interface MatchInterface {
  // _id?: Types.ObjectId;
  startTimestamp?: Date;
  endTimestamp?: Date;
  matchType: string;
  winner?: Types.ObjectId;
  players: Types.Array<MatchPlayer>;
  comment?: string;
}

const pointSchema = new Schema<MatchPoint>({
  type: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

const playerSchema = new Schema<MatchPlayer>({
  userId: { type: Schema.Types.ObjectId, required: true },
  points: {
    type: [pointSchema],
    required: true,
    default: []
  },
  color: { type: String, required: true }
});

const matchSchema = new Schema<MatchInterface>({
  // _id: { type: Schema.Types.ObjectId, required: false },
  startTimestamp: { type: Date, required: false },
  endTimestamp: { type: Date, required: false },
  matchType: { type: String, required: true },
  winner: { type: Schema.Types.ObjectId, required: false },
  players: {
    type: [playerSchema],
    required: true
  },
  comment: { type: String, required: false }
});

const Match = mongoose.model("Match", matchSchema);

export default Match;

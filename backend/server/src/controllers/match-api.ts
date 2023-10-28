import Match, {
  type MatchInterface,
  type MatchPlayer
} from "../models/match-model.js";
import { type Request, type Response } from "express";
import { type ClientSession } from "mongoose";

// (TODO: provide user player names. Requires querying User)
export const getMatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const matchId = req.params.id;

  let match = null;
  try {
    match = await Match.findById(matchId);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Getting match failed. Check matchId"
    });
  }

  if (match === null) {
    return res.status(404).json({ error: "Getting match failed. Not found" });
  }

  return res.json(match);
};

/**
  {
    matchType: "",
    players: [
      {
        userId: ObjectId,
        color: "white"
      },
      {
        userId: ObjectId,
        color: "red"
      }
    ],
    comments: ""
  }
*/
export const postMatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { matchType, players, comments } = req.body;

  let savedMatch = null;
  try {
    const newMatch = new Match({
      matchType,
      players,
      comments
    });
    savedMatch = await newMatch.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "posting match failed" });
  }
  return res.status(201).json(savedMatch);
};

const resetMatch = (match: MatchInterface): void => {
  match.endTimestamp = undefined;
  match.winner = undefined;
  match.players.forEach((player) => {
    player.points.length = 0;
  });
};

const checkWinner = (
  match: MatchInterface,
  player0: MatchPlayer,
  player1: MatchPlayer,
  pointDate: Date
): void => {
  let player0Points = 0;
  let player1Points = 0;
  player0.points.forEach((point) => {
    if (point.type !== "hansoku") {
      ++player0Points;
    } else {
      player1Points += 0.5;
    }
  });
  player1.points.forEach((point) => {
    if (point.type !== "hansoku") {
      ++player1Points;
    } else {
      player0Points += 0.5;
    }
  });
  console.log("\nplayerPoints and anotherPlayerPoints:");
  console.log(player0Points);
  console.log(player1Points);

  const MAXIMUM_POINTS = 2;
  if (player0Points >= MAXIMUM_POINTS) {
    match.winner = player0.userId;
    match.endTimestamp = pointDate;
    console.log("Player", player0.color, "wins");
  } else if (player1Points >= MAXIMUM_POINTS) {
    match.winner = player1.userId;
    match.endTimestamp = pointDate;
    console.log("Player", player0.color, "lost due to a hansoku");
  }
};

const abortSession = async (session: ClientSession): Promise<void> => {
  await session.abortTransaction();
  await session.endSession();
};

/**
  {
    startTimestamp: "Date string",
    point: {
      color: "red"|"white",
      type: "",
      timestamp: "Date string"
    }
  }
*/
export const putMatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const matchId = req.params.id;
  const { startTimestamp, point, comment } = req.body;

  // There's something missing about mongoose validation if using update.

  let session = null;

  let updatedMatch = null;
  try {
    session = await Match.startSession();
    session.startTransaction();

    updatedMatch = await Match.findById(matchId, null, { session });
  } catch (error) {
    console.error(error);
    session != null && (await abortSession(session));

    return res.status(400).json({
      error: "Getting match to put to failed. Check matchId"
    });
  }
  if (updatedMatch === null) {
    session != null && (await abortSession(session));

    return res
      .status(404)
      .json({ error: "Getting match to put to failed. Not found" });
  }

  // Update the comment. TODO: sanitation
  if (typeof comment === "string") {
    updatedMatch.comment = comment;
  }

  // Start a match
  if (typeof startTimestamp === "string") {
    const startDate = new Date(startTimestamp);
    if (startDate.toString() === "Invalid Date") {
      session != null && (await abortSession(session));

      return res
        .status(400)
        .json({ error: "putting match failed. Invalid startTimestamp" });
    }
    resetMatch(updatedMatch);
    updatedMatch.startTimestamp = startDate;
  } else if (updatedMatch.winner !== undefined) {
    session != null && (await abortSession(session));

    return res
      .status(400)
      .json({ error: "Cannot add points to a finished match" });
  }

  // Add a point
  if (typeof point === "object") {
    const player = updatedMatch.players.find(
      (player) => player.color === point.color
    );
    const anotherPlayer = updatedMatch.players.find(
      (player) => player.color !== point.color
    );
    if (typeof player !== "object" || typeof anotherPlayer !== "object") {
      console.error("put match: broken match document");
      session != null && (await abortSession(session));

      return res.status(500).end();
    }

    const pointDate = new Date(point.timestamp);
    if (pointDate.toString() === "Invalid Date") {
      session != null && (await abortSession(session));

      return res
        .status(400)
        .json({ error: "putting match failed. Invalid point.timestamp" });
    }

    player.points.push({
      type: point.type,
      timestamp: pointDate
    });

    checkWinner(updatedMatch, player, anotherPlayer, pointDate);
  }

  try {
    const result = res.json(await updatedMatch.save(/* { session } */));
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    console.error(error);
    session != null && (await abortSession(session));

    return res.status(500).json({ error: "putting match failed" });
  }
};

export const deleteMatch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const matchId = req.params.id;

  let deleteObject = null;
  try {
    deleteObject = await Match.deleteOne({ _id: matchId });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Deleting match failed. Check matchId"
    });
  }

  return res.status(204).json(deleteObject);
};

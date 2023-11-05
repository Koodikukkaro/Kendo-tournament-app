import Match from "../models/match-model.js";
import { type Request, type Response } from "express";

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

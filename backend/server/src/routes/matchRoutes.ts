import { getMatch, postMatch, deleteMatch } from "../controllers/match-api.js";
import { putMatch } from "../controllers/match-put-api.js";
import { Router } from "express";

const matchRoutes = Router();

// Retrieve details of a specific Kendo match by its unique ID.
matchRoutes.get("/:id", (req, res, next) => {
  getMatch(req, res).catch(next);
});

// Create a new Kendo match within a tournament.
matchRoutes.post("/", (req, res, next) => {
  postMatch(req, res).catch(next);
});

// Update the details of an existing Kendo match.
matchRoutes.put("/:id", (req, res, next) => {
  putMatch(req, res).catch(next);
});

// Delete a Kendo match.
matchRoutes.delete("/:id", (req, res, next) => {
  deleteMatch(req, res).catch(next);
});

export default matchRoutes;

import { Router } from "express";

// import { controller } from "../controllers/.ts";
const matchRoutes = Router();

// Retrieve details of a specific Kendo match by its unique ID.
matchRoutes.get("/:id", (req, res, next) => {
  // .catch(next);
  res.send("get");
});

// Create a new Kendo match within a tournament.
matchRoutes.post("/", (req, res, next) => {
  // .catch(next);
  res.send("post");
});

// Update the details of an existing Kendo match.
matchRoutes.put("/:id", (req, res, next) => {
  // .catch(next);
  res.send("put");
});

// Delete a Kendo match.
matchRoutes.delete("/:id", (req, res, next) => {
  // .catch(next);
  res.send("delete");
});

export default matchRoutes;

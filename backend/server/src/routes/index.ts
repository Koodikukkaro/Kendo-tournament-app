import express from "express";
import matchRoutes from "./matchRoutes.js";
import userRoutes from "./userRoutes.js";

const mainRouter = express.Router();

// Use the imported routes
mainRouter.use("/match", matchRoutes);
mainRouter.use("/user", userRoutes);

export default mainRouter;

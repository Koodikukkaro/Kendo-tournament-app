import express from "express";

// Import controller methods
import { registerAPI } from "../controllers/registerApi.js";
import { loginAPI } from "../controllers/loginApi.js";
import { getProfileAPI } from "../controllers/profileApi.js";
const userRoutes = express.Router();

// Define routes
userRoutes.post("/register", (req, res, next) => {
  registerAPI(req, res).catch(next);
});

userRoutes.post("/login", (req, res, next) => {
  loginAPI(req, res).catch(next);
});

userRoutes.get("/:id", (req, res, next) => {
  getProfileAPI(req, res).catch(next);
});

export default userRoutes;

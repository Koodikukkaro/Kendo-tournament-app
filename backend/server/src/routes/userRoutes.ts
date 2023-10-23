import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";

// Import controller methods
import { registerAPI } from "../controllers/registerApi.js";
import { loginAPI } from "../controllers/loginApi.js";
import { getProfileAPI } from "../controllers/profileApi.js";
import { RefreshAPI } from "../controllers/refreshApi.js";

const userRoutes = Router();

// Define routes
userRoutes.post("/register", (req, res, next) => {
  registerAPI(req, res).catch(next);
});

userRoutes.post("/login", (req, res, next) => {
  loginAPI(req, res).catch(next);
});

userRoutes.get("/:id", authenticateJWT, (req, res, next) => {
  getProfileAPI(req, res).catch(next);
});

userRoutes.post("/logout", authenticateJWT, (req, res, next) => {
  res.clearCookie("token");
  res.json({
    message: "Successfully logged out!"
  });
});

userRoutes.post("/refresh", (req, res, next) => {
  RefreshAPI(req, res).catch(next);
});


export default userRoutes;

import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user-model.js";
import { generateToken, generateRefreshToken } from "../utility/jwtHelper.js";

export const loginAPI = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  // Check if the email exists
  const user = await User.findOne({ email });
  if (user === null || user === undefined) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check if the password matches
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate a session here.
  const jwtToken = generateToken({
    __id: user._id,
    email: user.email
  });

  // generate refresh token
  const jwtRefreshToken = generateRefreshToken({
    __id: user._id
  });

  res.cookie("token", jwtToken, { httpOnly: true });
  res.cookie("refresh", jwtRefreshToken, { httpOnly: true });

  return res.json({
    user_id: user._id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    phone: user.phoneNumber,
    club: user.clubName,
    dan: user.danRank,
    underage: user.underage,
    guardian: user.guardiansEmail,
    created_on: user.createdAt,
    last_updated_on: user.updatedAt
  });
};

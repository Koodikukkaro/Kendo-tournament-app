import { type Request, type Response } from "express";
import User from "../models/user-model.js";

export const getProfileAPI = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user === null || user === undefined) {
      return res.status(404).json({ error: "User not found" });
    }

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
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the user profile" });
  }
};

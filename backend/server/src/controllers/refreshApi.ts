import { type Request, type Response } from "express";
import {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyToken,
} from "../utility/jwtHelper.js";
import User from "../models/user-model.js";

export const RefreshAPI = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const refreshToken = req.cookies.refresh;
    const token = req.cookies.token;

    if (refreshToken === null || refreshToken === undefined) {
        return res.status(401).json({ error: "Refresh token not found" });
    }

    try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        const tokenPayload = verifyToken(token);

        if (refreshPayload.__id !== tokenPayload.__id) {
            throw new Error("Refresh payload __id and token __id didn't match!");
        }

        const user = await User.findOne({ _id: refreshPayload.__id });
        if (user === null || user === undefined) {
            console.log("User is null or undefined!");
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }

        const jwtToken = generateToken({
            __id: user._id,
            email: user.email,
        });

        const jwtRefreshToken = generateRefreshToken({
            __id: user._id,
        });

        // TODO: might need to add the tokens in the database.

        res.cookie("token", jwtToken, { httpOnly: true }); // sameSite: 'strict'
        res.cookie("refresh", jwtRefreshToken, { httpOnly: true });
        return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
};

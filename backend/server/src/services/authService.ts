import BadRequestError from "../errors/BadRequestError.js";
import { type LoginRequest } from "../models/requestModel.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import UserModel from "../models/userModel.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  type TokenPayload
} from "../utility/jwtHelper.js";
import MatchModel from "../models/matchModel.js";
import type { LoginResponse } from "../models/responseModel.js";

export class AuthService {
  public async loginUser(requestBody: LoginRequest): Promise<LoginResponse> {
    const { email, password } = requestBody;

    const user = await UserModel.findOne({ email })
      .select("+password")
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (user === null || user === undefined) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    // Find tournaments where the user is an admin
    const adminTournaments = await MatchModel.find({ admin: user.id })
      .select("admin")
      .exec();

    // Find tournaments where the user is an official
    const officialTournaments = await MatchModel.find({
      officials: { $in: [user.id] }
    })
      .select("officials")
      .exec();

    const tokenPayload: TokenPayload = {
      id: user.id,
      adminTournaments: adminTournaments.map((tournament) => tournament.id),
      officialTournaments: officialTournaments.map(
        (tournament) => tournament.id
      )
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  public async refreshAccessToken(
    refreshToken: string | undefined
  ): Promise<string[]> {
    if (refreshToken === undefined) {
      throw new BadRequestError({ message: "Refresh token not found" });
    }

    const decoded = await verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(decoded.id)
      .select("+refreshToken")
      .exec();

    if (user?.refreshToken === undefined) {
      throw new UnauthorizedError({
        message: "Invalid refresh token"
      });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      adminTournaments: decoded.adminTournaments,
      officialTournaments: decoded.officialTournaments
    });

    return [newAccessToken, user.refreshToken];
  }
}

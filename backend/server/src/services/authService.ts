import BadRequestError from "../errors/BadRequestError.js";
import { type LoginRequest } from "../models/requestModel.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import userModel from "../models/userModel.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  type TokenPayload
} from "../utility/jwtHelper.js";

export class AuthService {
  public async createTokens(requestBody: LoginRequest): Promise<string[]> {
    const { email, password } = requestBody;

    const user = await userModel.findOne({ email }).select("+password").exec();

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

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      scopes: [user.role]
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    return [accessToken, refreshToken];
  }

  public async refreshAccessToken(refreshToken: string): Promise<string[]> {
    if (refreshToken === undefined) {
      throw new BadRequestError({ message: "Refresh token not found" });
    }

    const decoded = await verifyRefreshToken(refreshToken);

    const user = await userModel
      .findById(decoded.id)
      .select("+refreshToken")
      .exec();

    if (user?.refreshToken === undefined) {
      throw new UnauthorizedError({
        message: "Invalid refresh token"
      });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      scopes: decoded.scopes
    });

    return [newAccessToken, user.refreshToken];
  }
}

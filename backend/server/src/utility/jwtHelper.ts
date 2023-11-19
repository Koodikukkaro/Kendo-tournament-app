import jwt from "jsonwebtoken";
import config from "./config";
import UnauthorizedError from "../errors/UnauthorizedError";

export interface TokenPayload {
  id: string;
  adminTournaments: string[];
  officialTournaments: string[];
}

export const generateAccessToken = (
  payload: TokenPayload,
  expiresIn: string = "1h"
): string => {
  return jwt.sign(payload, config.ACCESS_JWT_SECRET, { expiresIn });
};

export function generateRefreshToken(
  payload: TokenPayload,
  expiresIn: string = "7d"
): string {
  return jwt.sign(payload, config.REFRESH_JWT_SECRET, {
    expiresIn
  });
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, config.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err !== null) {
        reject(
          new UnauthorizedError({
            message: err.message ?? "Invalid or expired refresh token"
          })
        );
      } else {
        // Cast the decoded token to JwtPayload and then resolve it
        resolve(decoded as unknown as TokenPayload);
      }
    });
  });
}

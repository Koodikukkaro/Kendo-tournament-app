import jwt from "jsonwebtoken";

const SECRET_KEY: string = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY: string = process.env.JWT_REFRESH_SECRET as string;

if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error('Missing JWT_SECRET or JWT_REFRESH_SECRET environment variables');
}

export function generateToken(payload: any, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, SECRET_KEY);
}

export function generateRefreshToken(payload: any, expiresIn: string = "7d"): string {
  // Limit the payload information for refresh tokens
  const refreshTokenPayload = {
    __id: payload.__id,
    type: "refresh"
  };
  return jwt.sign(refreshTokenPayload, REFRESH_SECRET_KEY, { expiresIn });
}

export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, REFRESH_SECRET_KEY);
}

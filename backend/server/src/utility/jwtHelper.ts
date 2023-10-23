import jwt from "jsonwebtoken";

const SECRET_KEY: string = process.env.JWT_SECRET as string;

if (SECRET_KEY === null || SECRET_KEY === undefined) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export function generateToken(payload: any, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, SECRET_KEY);
}

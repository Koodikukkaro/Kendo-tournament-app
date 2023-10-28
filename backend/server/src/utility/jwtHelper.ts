import jwt from "jsonwebtoken";

const SECRET_KEY: string = process.env.JWT_SECRET as string;

if (SECRET_KEY === null || SECRET_KEY === undefined) {
  throw new Error("Missing JWT_SECRET environment variable");
}

interface Payload {
  __id: string;
  email: string;
}

export function generateToken(payload: Payload, expiresIn: string = "15m"): string {
  try {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;  // re-throw or handle the error as needed
  }
}

export function verifyToken(token: string): any {
  return jwt.verify(token, SECRET_KEY);
}

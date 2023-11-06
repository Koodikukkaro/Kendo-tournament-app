import type * as express from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import config from "../utility/config.js";

// Redeclare the jsonwebtoken module with an extended Payload
declare module "jsonwebtoken" {
  export interface JwtPayload {
    scopes: string[];
  }
}

// Define a type guard function to check if the payload is of type JwtPayload
const isJwtPayload = (decoded: any): decoded is JwtPayload => {
  return (
    typeof decoded === "object" &&
    Array.isArray(decoded.scopes) &&
    decoded.exp !== undefined &&
    decoded.iat !== undefined
  );
};

export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  scopes?: string[]
): Promise<unknown> {
  const accessToken: string = request.cookies.accessToken;

  return await new Promise((resolve, reject) => {
    if (accessToken === undefined) {
      reject(new UnauthorizedError({ message: "No access token provided." }));
      return;
    }

    jwt.verify(
      accessToken,
      config.ACCESS_JWT_SECRET,
      (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err !== null || !isJwtPayload(decoded)) {
          reject(
            new UnauthorizedError({
              message: err?.message ?? "Invalid token signature."
            })
          );
          return;
        }

        if (scopes !== undefined) {
          // Check if JWT contains all required scopes
          for (const scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(
                new ForbiddenError({
                  message: "JWT does not contain the required scope."
                })
              );
              return;
            }
          }
        }
        resolve(decoded);
      }
    );
  });
}

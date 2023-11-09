import type * as express from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import config from "../utility/config.js";
import { UserRole } from "../models/requestModel.js";

// Redeclare the jsonwebtoken module with an extended Payload
declare module "jsonwebtoken" {
  export interface JwtPayload {
    role: UserRole;
  }
}

// Define a type guard function to check if the payload is of type JwtPayload
const isJwtPayload = (decoded: any): decoded is JwtPayload => {
  return (
    typeof decoded === "object" &&
    decoded.role !== undefined &&
    decoded.exp !== undefined &&
    decoded.iat !== undefined
  );
};

const getUserRoleFromString = (roleString: string): UserRole | undefined => {
  switch (roleString.toLowerCase()) {
    case "admin":
      return UserRole.Admin;
    case "official":
      return UserRole.Official;
    case "player":
      return UserRole.Player;
    default:
      return undefined;
  }
};

export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  roles: string[] = []
): Promise<unknown> {
  const accessToken: string = request.cookies.accessToken;

  return await new Promise((resolve, reject) => {
    if (accessToken === undefined) {
      reject(new UnauthorizedError({ message: "No access token provided." }));
      return;
    }

    const validatedRoles = roles.map(getUserRoleFromString);

    // Validate roles specified for the controller
    if (validatedRoles.includes(undefined)) {
      const userRoleKeys = Object.keys(UserRole)
        .filter((v) => isNaN(Number(v)))
        .join(", ");

      reject(
        new TypeError(
          `Undefined roles declared for the '${request.method}: ${request.url}' controller. The defined roles are ${userRoleKeys}`
        )
      );
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

        // Disable eslint error since we have already validated the roles and are confident about its structure
        if (
          validatedRoles.length === 0 ||
          validatedRoles.some((role) => decoded.role >= role!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
        ) {
          resolve(decoded);
        } else {
          reject(
            new ForbiddenError({
              message: "Insufficient permissions"
            })
          );
        }
      }
    );
  });
}

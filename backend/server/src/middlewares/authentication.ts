import type * as express from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import config from "../utility/config.js";
import { type ObjectIdString } from "../models/requestModel.js";

// Redeclare the jsonwebtoken module with an extended Payload
declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: ObjectIdString;
    adminTournaments: string[];
    officialTournaments: string[];
  }
}

// Define a type guard function to check if the payload is of type JwtPayload
const isJwtPayload = (decoded: any): decoded is JwtPayload => {
  return (
    typeof decoded === "object" &&
    decoded.exp !== undefined &&
    decoded.iat !== undefined
  );
};

export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  scopes: string[] = []
): Promise<unknown> {
  const accessToken: string = request.cookies.accessToken;

  // Only tournaments and matches require to be authorized
  const requestedResource: string =
    request.params.tournamentId ?? request.params.matchId;

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

        // If the requestedResouce is not defined,
        // it means that the requested resource doesnt require authorization.
        if (requestedResource === undefined) {
          resolve(decoded);
          return;
        }

        const isAdminForTheResource =
          decoded.adminTournaments.includes(requestedResource);

        const isOfficialForTheResource =
          decoded.officialTournaments.includes(requestedResource);

        if (
          scopes.length === 0 ||
          (scopes.includes("admin") && isAdminForTheResource) ||
          (scopes.includes("official") &&
            (isOfficialForTheResource || isAdminForTheResource))
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

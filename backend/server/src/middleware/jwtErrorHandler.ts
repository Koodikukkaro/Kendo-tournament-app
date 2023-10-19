import { Request, Response, NextFunction } from 'express';

export function jwtErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err.name === "UnauthorizedError") {
    // Handle the error here
    res.status(401).send("Invalid or expired token");
  } else {
    next(err);
  }
}

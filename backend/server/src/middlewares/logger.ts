import { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import { ValidateError } from "tsoa";
import logger from "../utility/logger";

// Might be preferable to get rid of morgan
// Can't use "dev" because of winston file logging
export const httpLogger = morgan("tiny", {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    }
  },
  // errorLogger logs errors. However, errorLogger may not be able
  // to acquire the proper status code
  skip: (req: Request, res: Response) => res.statusCode >= 400
});

export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ValidateError) {
    logger.warn(error.name, { error, requestPath: req.path });

    next(error);
    return;
  }

  logger.error(error.name, { error, requestPath: req.path });

  next(error);
};

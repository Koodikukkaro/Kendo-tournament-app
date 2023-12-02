import { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import { ValidateError } from "tsoa";
import logger from "../utility/logger";

export const httpLogger = morgan("tiny", {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  },
  // errorLogger logs errors
  skip: (req: Request, res: Response) => res.statusCode >= 400
});

export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ValidateError) {
    // logger.warn(error.message, { error });
    // logger.warn(error);
    // logger.warn(error.name, error.fields);
    logger.warn(error.name, {
      requestPath: req.path,
      errorFields: error.fields
    });
    next(error);
    return;
  }

  logger.error(error.message, { error });

  next(error);
};

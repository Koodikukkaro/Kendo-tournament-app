import { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import { ValidateError } from "tsoa";
import logger from "../utility/logger";

// Can't use "dev" because of winston file logging
export const httpLogger = morgan("tiny", {
  stream: {
    write: (message) => {
      logger.http(message.trim());
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
    logger.warn(error.name, { error, requestPath: req.path });
    // logger.warn(error.name, {
    //   requestPath: req.path,
    //   errorFields: error.fields,
    //   statusCode: error.status
    // });
    next(error);
    return;
  }

  logger.error(error.name, { error, requestPath: req.path });
  // logger.error(error.name { errorFields: error.fields });

  next(error);
};

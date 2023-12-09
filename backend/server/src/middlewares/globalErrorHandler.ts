/* Log errors and send a response

*/
import { type NextFunction, type Request, type Response } from "express";
import { ValidateError } from "tsoa";

import { CustomError } from "../errors/CustomError.js";
import logger from "../utility/logger";

export const globalErrorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response<any, Record<string, any>> => {
  // logger.debug(error.name, {
  //   error,
  //   requestPath: req.path,
  //   stack: error.stack
  // });
  const basicErrorLog = { error, requestPath: req.path };

  if (error instanceof CustomError) {
    const { statusCode, errors, logging } = error;

    // What is "logging"?
    if (logging) {
      // logger.error(error.name, basicErrorLog);
      logger.error(error.name, {
        code: error.statusCode,
        errors: error.errors,
        stack: error.stack
      });
    }

    return res.status(statusCode).send({ errors });
  }

  if (error instanceof ValidateError) {
    logger.warn(error.name, basicErrorLog);

    const { fields } = error;
    return res
      .status(400)
      .send({ errors: [{ message: "Validation error", context: fields }] });
  }

  // Unhandled errors
  // logger.error(error.name, basicErrorLog);
  logger.error(error.name, {
    code: 500,
    message: error.message,
    stack: error.stack
  });

  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

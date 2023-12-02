import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../errors/CustomError.js";
import { ValidateError } from "tsoa";

export const globalErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response<any, Record<string, any>> => {
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stack: err.stack
          },
          null,
          2
        )
      );
    }

    return res.status(statusCode).send({ errors });
  }

  if (err instanceof ValidateError) {
    const { fields } = err;
    // console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res
      .status(400)
      .send({ errors: [{ message: "Validation error", context: fields }] });
  }

  // Unhandled errors
  console.error(
    JSON.stringify(
      {
        code: 500,
        message: err.message,
        stack: err.stack
      },
      null,
      2
    )
  );
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

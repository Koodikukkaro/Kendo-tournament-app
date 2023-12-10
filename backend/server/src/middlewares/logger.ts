import morgan from "morgan";
import logger from "../utility/logger";

export const httpLogger = morgan("tiny", {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    }
  }
  // globalErrorHandler logs errors. However, it
  // may not be able to acquire the proper status code
  // skip: (req: Request, res: Response) => res.statusCode >= 400
});

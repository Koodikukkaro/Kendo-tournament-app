import morgan from "morgan";
import logger from "../utility/logger";

export const httpLogger = morgan("tiny", {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
});

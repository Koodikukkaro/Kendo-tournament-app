import { type Request, type Response, type NextFunction } from "express";
import logger from "../utility/logger";

const loggerware = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export default loggerware;

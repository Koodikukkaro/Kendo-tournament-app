// https://www.npmjs.com/package/winston
import { createLogger, transports, format } from "winston";

const consoleFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.simple()
);
const fileFormat = format.combine(format.timestamp(), format.json());

const logger = createLogger({
  // level: "debug",
  // level: "http",
  level: "info",
  // https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: "logs/winston-log",
      format: fileFormat,
      // Limit system resource usage:
      // 1 MB in bytes:
      maxsize: 1048576,
      // No justification for the number but it's probably good to have some.
      maxFiles: 5
    })
  ]
});

export default logger;

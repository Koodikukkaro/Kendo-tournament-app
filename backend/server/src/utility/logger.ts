import { createLogger, transports, format } from "winston";

const logger = createLogger({
  // https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport
  transports: [new transports.Console()],
  // exceptionHandlers: [new winston.transports.Console()],
  // Winston will exit after logging an uncaughtException, unless
  // exitOnError: false,
  // rejectionHandlers: [new winston.transports.Console()],
  // format: winston.format.printf((info) => `${info.message}`)
  format: format.combine(
    // Works except for json.
    format.colorize({ colors: { error: "red" } }),

    format.simple()
    // format.errors({ stack: true })
  )
});

export default logger;

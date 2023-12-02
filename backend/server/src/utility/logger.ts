import winston from "winston";

const logger = winston.createLogger({
  // https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  // Winston will exit after logging an uncaughtException, unless
  // exitOnError: false,
  rejectionHandlers: [new winston.transports.Console()],
  // format: winston.format.printf((info) => `${info.message}`)
  format: winston.format.combine(
    // format.colorize()
    // winston.format.timestamp(),
    winston.format.simple(),
    winston.format.errors({ stack: true })
    // winston.format.json()
  )
});

export default logger;

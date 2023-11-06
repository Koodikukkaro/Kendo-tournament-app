import connectDB from "./utility/db.js";
import express, {
  type Application,
  type Request,
  type Response
} from "express";
import mongoose from "mongoose";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes.js";
import swaggerDocument from "../build/swagger.json";
import { globalErrorHandlerMiddleware } from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import config from "./utility/config.js";

// initialize mongo connection.
await connectDB();

const app: Application = express();
const port = config.PORT;

/**
 * To use build-in JSON middleware from express
 * & parse incoming request bodies with URL-encoded payloads
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Register the auto generated routes
 */
RegisterRoutes(app);

/**
 * Serves swagger
 */
app.use("/docs", swaggerUi.serve, (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(swaggerDocument));
});

/**
 * Error handling middleware
 */
app.use(globalErrorHandlerMiddleware);

/**
 * Logging middleware
 */
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 0) {
    res.send("Mongo connection disconnected. API works.");
  } else if (mongoose.connection.readyState === 1) {
    res.send("Mongo connection connected. API works.");
  } else if (mongoose.connection.readyState === 2) {
    res.send("Mongo connection connecting. API works.");
  } else {
    res.send("Mongo connection disconnecting. API works.");
  }
});

app.listen(port, () => {
  console.log("$--------------------------------------$");
  console.log(`Server is Fire at http://localhost:${port}`);
  console.log("$--------------------------------------$");
});

import express, {
  type Request,
  type Response,
  type Application
} from "express";
import dotenv from "dotenv";
import connectDB from "./utility/db.js";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import mainRouter from "./routes/index.js";

dotenv.config();

// initialize mongo connection.
await connectDB();

const app: Application = express();
const port = process.env.PORT ?? 8080;

/**
 * To use build-in JSON middleware from express
 * & parse incoming request bodies with URL-encoded payloads
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serves swagger
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Logging middleware
 */
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * Main Router;
 * All routes will now be prefixed with /api
 */
app.use("/api", mainRouter);

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

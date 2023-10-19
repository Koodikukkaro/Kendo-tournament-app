import express, {
  type Request,
  type Response,
  type Application,
  type NextFunction
} from "express";
import dotenv from "dotenv";
import connectDB from "./utility/db.js";

import cookieParser from 'cookie-parser';

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
app.use(cookieParser());

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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      "message": 'Invalid or expired token'
    });
  } else {
    next(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("$--------------------------------------$");
  console.log(`Server is Fire at http://localhost:${port}`);
  console.log("$--------------------------------------$");
});

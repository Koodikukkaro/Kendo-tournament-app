import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import mongoose from 'mongoose';
import { registerAPI } from './controllers/user-controller.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from './swagger.js';


dotenv.config();

// initialize mongo connection.
connectDB();

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


/**
 * USER - API
 */
app.post('/api/register', registerAPI);

app.get('/', (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 0) {
    res.send('Mongo connection disconnected. API works.');
  } else if (mongoose.connection.readyState === 1) {
    res.send('Mongo connection connected. API works.');
  }
  else if (mongoose.connection.readyState === 2) {
    res.send('Mongo connection connecting. API works.');
  }
  else {
    res.send('Mongo connection disconnecting. API works.');
  }
});

app.listen(port, () => {
  console.log("$--------------------------------------$");
  console.log(`Server is Fire at http://localhost:${port}`);
  console.log("$--------------------------------------$");
});

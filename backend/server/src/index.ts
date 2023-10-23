import matchRoutes from "./routes/matchRoutes.js";
import express, {
  type Request,
  type Response,
  type Application
} from "express";
import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI === undefined) {
  throw new Error("DOTENV issues with MONGODB_URI");
}
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to mongo`);
  })
  .catch((e) => {
    console.log(`Not connected to mongo`);
  });

const app: Application = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());

app.use("/api/match", matchRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("success!");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

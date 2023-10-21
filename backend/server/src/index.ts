import express, {
  type Request,
  type Response,
  type Application
} from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT ?? 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("success!");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

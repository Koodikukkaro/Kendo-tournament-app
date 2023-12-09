import "reflect-metadata";
import "dotenv/config";
import connectDB from "./utility/db.js";
import config from "./utility/config.js";
import { CreateApp } from "./utility/app.js";
import http from "http";
import { initSocket } from "./socket.js";

await connectDB();

const port = config.PORT;
const baseURL = config.SERVER_HOST;

const app = CreateApp();

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Server is Fire at ${baseURL}:${port}`);
});

import dotenv from "dotenv";
dotenv.config();

const ACCESS_JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT ?? 8080;
const MONGO_URL = process.env.MONGODB_URL;

if (
  ACCESS_JWT_SECRET === undefined ||
  REFRESH_JWT_SECRET === undefined ||
  MONGO_URL === undefined
) {
  throw new Error("Required environment variables are not defined.");
}

export default {
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  MONGO_URL,
  PORT
};

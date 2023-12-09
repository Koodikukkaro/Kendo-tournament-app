import dotenv from "dotenv";
dotenv.config();

const ensureEnvVariable = (variableName: string, variable?: string): string => {
  if (variable === undefined) {
    throw new Error(
      `Required environment variable '${variableName}' is not defined.`
    );
  }
  return variable;
};

const PORT = ensureEnvVariable("PORT", process.env.PORT ?? "8080");

const MONGO_URL = ensureEnvVariable("MONGODB_URL", process.env.MONGODB_URL);

const SERVER_HOST = ensureEnvVariable(
  "SERVER_HOST",
  process.env.SERVER_HOST ?? "http://localhost"
);

const CLIENT_HOST = ensureEnvVariable(
  "CLIENT_HOST",
  process.env.CLIENT_HOST ?? "http://localhost:3000"
);

const ACCESS_JWT_SECRET = ensureEnvVariable(
  "JWT_SECRET",
  process.env.JWT_SECRET
);

const REFRESH_JWT_SECRET = ensureEnvVariable(
  "JWT_SECRET",
  process.env.JWT_SECRET
);

export default {
  SERVER_HOST,
  CLIENT_HOST,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  MONGO_URL,
  PORT
};

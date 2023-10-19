import { expressjwt } from "express-jwt";

const SECRET_KEY: string = process.env.JWT_SECRET as string;

export const authenticateJWT = expressjwt({
  secret: SECRET_KEY,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.token
});

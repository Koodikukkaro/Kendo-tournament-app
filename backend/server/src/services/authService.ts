import BadRequestError from "../errors/BadRequestError.js";
import {
  type LoginRequest,
  type RegisterRequest
} from "../models/requestModel.js";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import userModel, { type User } from "../models/userModel.js";

export class AuthService {
  public async loginUser(requestBody: LoginRequest): Promise<User> {
    const user = await userModel
      .findOne({ email: requestBody.email })
      .select("+password")
      .exec();

    if (user === null || user === undefined) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    const validPassword = await bcrypt.compare(
      requestBody.password,
      user.password
    );

    if (!validPassword) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    // TODO: return a token instead of a user.
    return await user.toObject();
  }

  public async registerUser(requestBody: RegisterRequest): Promise<User> {
    const { underage, guardiansEmail, email, password } = requestBody;

    if (underage && (guardiansEmail === null || guardiansEmail === "")) {
      throw new BadRequestError({
        message: "Guardian's email is required for underage users"
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser != null) {
      throw new BadRequestError({
        message: "Email for this user already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      ...requestBody,
      password: hashedPassword
    });

    // TODO: return a token instead of a user.
    return await newUser.toObject();
  }
}

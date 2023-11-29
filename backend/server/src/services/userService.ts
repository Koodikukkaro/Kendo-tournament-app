import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";
import { type RegisterRequest } from "../models/requestModel.js";
import UserModel, { type User } from "../models/userModel.js";

export class UserService {
  public async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id).exec();

    if (user === null || user === undefined) {
      throw new NotFoundError({
        message: "User not found"
      });
    }

    return await user.toObject();
  }

  public async registerUser(requestBody: RegisterRequest): Promise<void> {
    const { underage, guardiansEmail, email } = requestBody;

    if (underage && (guardiansEmail === null || guardiansEmail === "")) {
      throw new BadRequestError({
        message: "Guardian's email is required for underage users"
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser != null) {
      throw new BadRequestError({
        message: "Email for this user already exists"
      });
    }

    await UserModel.create(requestBody);
  }

  public async searchUser(query: string): Promise<User[]> {
    const searchQuery = new RegExp(query, "i");
    return await UserModel.find({
      $or: [
        { userName: { $regex: searchQuery } },
        { email: { $regex: searchQuery } },
        { firstName: { $regex: searchQuery } },
        { lastName: { $regex: searchQuery } }
      ]
    }).select("firstName lastName _id email userName");
  }
}

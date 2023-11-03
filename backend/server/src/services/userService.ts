import NotFoundError from "../errors/NotFoundError.js";
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
}

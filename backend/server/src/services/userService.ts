import { Types, type HydratedDocument } from "mongoose";
import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";
import type {
  EditUserRequest,
  RegisterRequest
} from "../models/requestModel.js";
import UserModel, { type User } from "../models/userModel.js";

export class UserService {
  public async getUserById(id: string): Promise<User> {
    return await (await this.getUserDocumentById(id)).toObject();
  }

  public async registerUser(requestBody: RegisterRequest): Promise<void> {
    const { underage, guardiansEmail, email } = requestBody;

    if (underage && (guardiansEmail === undefined || guardiansEmail === "")) {
      throw new BadRequestError({
        message: "Guardian's email is required for underage users"
      });
    }

    const existingUser = await UserModel.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (existingUser != null) {
      throw new BadRequestError({
        message: "Email already exists"
      });
    }

    await UserModel.create(requestBody);
  }

  public async updateUserById(
    id: string,
    requestBody: EditUserRequest
  ): Promise<void> {
    const userDoc = await this.getUserDocumentById(id);

    if (
      requestBody.underage &&
      (requestBody.guardiansEmail === undefined ||
        requestBody.guardiansEmail === "")
    ) {
      throw new BadRequestError({
        message: "Guardian's email is required for underage users"
      });
    }

    /* If the user has changed their email, check if the email is already reserved */
    if (userDoc.email !== requestBody.email) {
      const existingUser = await UserModel.findOne({ email: requestBody.email })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (existingUser != null) {
        throw new BadRequestError({
          message: "Email already exists"
        });
      }
    }

    userDoc.set(requestBody);

    await userDoc.save();
  }

  /*
   * Overwrites the user's personal information, but for the time being,
   * we must preserve the user document in the database to avoid breaking existing functionalities.
   * */
  public async deleteUserById(id: string): Promise<void> {
    const userDoc = await this.getUserDocumentById(id);

    /* Will be displayed as deleted_user_randomId in tournaments, matches, etc.
     * Most important thing is that we remove all of the user's personal data.
     */
    const deletedUser: User = {
      id: userDoc.id,
      email: " ",
      password: " ",
      userName: `deleted_user_${new Types.ObjectId().toHexString()}`,
      phoneNumber: " ",
      firstName: " ",
      lastName: " ",
      inNationalTeam: false,
      underage: false
    };

    /* Overwrite all values in the document */
    const newDoc = userDoc.overwrite(deletedUser);

    await newDoc.save();
  }

  private async getUserDocumentById(
    id: string
  ): Promise<HydratedDocument<User>> {
    const user = await UserModel.findById(id).exec();

    if (user === null || user === undefined) {
      throw new NotFoundError({
        message: "User not found"
      });
    }

    return user;
  }
}

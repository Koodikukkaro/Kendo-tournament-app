import { Route, Controller, Get, Path, Tags } from "tsoa";
import { type User } from "../models/userModel.js";
import { UserService } from "../services/userService.js";
import { ObjectIdString } from "../models/requestModel.js";

@Route("user")
export class UserController extends Controller {
  @Get("{id}")
  @Tags("User")
  public async getUser(@Path() id: ObjectIdString): Promise<User> {
    this.setStatus(200);
    return await this.service.getUserById(id);
  }

  private get service(): UserService {
    return new UserService();
  }
}

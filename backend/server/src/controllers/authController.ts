import { Controller, Route, Post, Tags, Body } from "tsoa";
import { LoginRequest, RegisterRequest } from "../models/requestModel.js";
import { AuthService } from "../services/authService.js";
import { type User } from "../models/userModel.js";

// TODO: Need to return a JWT Token instead of the User Data.
@Route("auth")
export class AuthController extends Controller {
  @Post("login")
  @Tags("Auth")
  public async loginUser(@Body() requestBody: LoginRequest): Promise<User> {
    this.setStatus(200);
    return await this.service.loginUser(requestBody);
  }

  @Post("register")
  @Tags("Auth")
  public async registerUser(
    @Body() requestBody: RegisterRequest
  ): Promise<User> {
    this.setStatus(201);
    return await this.service.registerUser(requestBody);
  }

  private get service(): AuthService {
    return new AuthService();
  }
}

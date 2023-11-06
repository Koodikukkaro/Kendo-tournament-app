import { Controller, Route, Post, Tags, Body, Request } from "tsoa";
import { LoginRequest, RegisterRequest } from "../models/requestModel.js";
import { AuthService } from "../services/authService.js";
import * as express from "express";

@Route("auth")
export class AuthController extends Controller {
  @Post("login")
  @Tags("Auth")
  public async loginUser(@Body() requestBody: LoginRequest): Promise<void> {
    this.setStatus(204);

    const [accessToken, refreshToken] =
      await this.service.createTokens(requestBody);

    this.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; Path=/api/; HttpOnly;`,
      `refreshToken=${refreshToken}; Path=/api/; HttpOnly;`
    ]);
  }

  @Post("logout")
  @Tags("Auth")
  public async logoutUser(): Promise<void> {
    this.setStatus(204);

    // Clear access and refresh token cookies
    this.setHeader("Set-Cookie", [
      `accessToken=; Path=/api/; HttpOnly;`,
      `refreshToken=; Path=/api/; HttpOnly;`
    ]);
  }

  @Post("register")
  @Tags("Auth")
  public async registerUser(
    @Body() requestBody: RegisterRequest
  ): Promise<void> {
    this.setStatus(204);

    await this.service.registerUser(requestBody);
  }

  @Post("refresh")
  @Tags("Auth")
  public async refreshToken(
    @Request() request: express.Request
  ): Promise<void> {
    this.setStatus(204);

    const x = this.getHeaders();
    console.log(x);
    const [accessToken, refreshToken] = await this.service.refreshAccessToken(
      request.cookies.refreshToken
    );

    this.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; Path=/api/; HttpOnly;`,
      `refreshToken=${refreshToken}; Path=/api/; HttpOnly;`
    ]);
  }

  private get service(): AuthService {
    return new AuthService();
  }
}

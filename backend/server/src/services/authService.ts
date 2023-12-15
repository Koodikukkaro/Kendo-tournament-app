import nodemailer from "nodemailer";
import type {
  ResetPasswordRequest,
  LoginRequest
} from "../models/requestModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import UserModel from "../models/userModel.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  type TokenPayload
} from "../utility/jwtHelper.js";
import MatchModel from "../models/matchModel.js";
import type { LoginResponseInternal } from "../models/responseModel.js";
import config from "../utility/config.js";

export class AuthService {
  public async loginUser(
    requestBody: LoginRequest
  ): Promise<LoginResponseInternal> {
    const { email, password } = requestBody;

    const user = await UserModel.findOne({ email })
      .select("+password")
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (user === null || user === undefined) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedError({
        message: "Invalid email or password"
      });
    }

    // Find tournaments where the user is an admin
    const adminTournaments = await MatchModel.find({ admin: user.id })
      .select("admin")
      .exec();

    // Find tournaments where the user is an official
    const officialTournaments = await MatchModel.find({
      officials: { $in: [user.id] }
    })
      .select("officials")
      .exec();

    const tokenPayload: TokenPayload = {
      id: user.id,
      adminTournaments: adminTournaments.map((tournament) => tournament.id),
      officialTournaments: officialTournaments.map(
        (tournament) => tournament.id
      )
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    return { user: user.toObject(), accessToken, refreshToken };
  }

  public async refreshAccessToken(
    refreshToken: string | undefined
  ): Promise<string[]> {
    if (refreshToken === undefined) {
      throw new BadRequestError({ message: "Refresh token not found" });
    }

    const decoded = await verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(decoded.id)
      .select("+refreshToken")
      .exec();

    if (user?.refreshToken === undefined) {
      throw new UnauthorizedError({
        message: "Invalid refresh token"
      });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      adminTournaments: decoded.adminTournaments,
      officialTournaments: decoded.officialTournaments
    });

    return [newAccessToken, user.refreshToken];
  }

  public async sendPasswordRecoveryMail(recipient: string): Promise<void> {
    const userDoc = await UserModel.findOne({ email: recipient })
      .select("+password")
      .collation({ locale: "en", strength: 2 })
      .exec();

    /* Silently return to avoid user enumeration */
    if (userDoc === null || userDoc === undefined) {
      return;
    }

    await userDoc.generatePasswordRecoveryToken();

    await userDoc.save();

    /*
     * If you have enabled 2-factor authentication on your Google account,
     * you cannot use your regular password. Instead, generate an app-specific
     * password and use that in place of your actual password to access Gmail programmatically.
     * https://support.google.com/accounts/answer/185833?hl=en
     */
    const transporter = nodemailer.createTransport({
      host: config.SERVER_HOST,
      service: "gmail",
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: config.EMAIL_USERNAME,
      to: recipient,
      subject: "Password Reset",
      text: `You are receiving this email because a password reset request was submitted for your account.\n\n
      Please click on the following link to reset your password:\n\n
      ${config.CLIENT_HOST}/password-reset?token=${userDoc.resetPasswordToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    try {
      /* Try send email */
      await transporter.sendMail(mailOptions);
    } catch (error) {
      /* If email sending fails, dont return an error to the user.
       * TODO: The error should be logged.
       */
      console.error(
        "Failed to send password recovery email",
        JSON.stringify(error, null, 2)
      );
    }
  }

  public async resetPassword({
    token,
    password
  }: ResetPasswordRequest): Promise<void> {
    const userDoc = await UserModel.findOne({
      resetPasswordToken: token
    }).exec();

    if (
      userDoc === null ||
      userDoc === undefined ||
      userDoc.isPasswordResetTokenExpired()
    ) {
      throw new BadRequestError({ message: "Invalid or expired reset token." });
    }

    /* Password is automatically hashed before save */
    userDoc.password = password;
    userDoc.resetPasswordToken = undefined;
    userDoc.resetPasswordExpires = undefined;

    await userDoc.save();
  }
}

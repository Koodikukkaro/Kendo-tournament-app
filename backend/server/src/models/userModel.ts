import mongoose, { Schema, type Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  id: Types.ObjectId;
  email: string;
  userName?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  inNationalTeam: boolean;
  suomisportId?: string;
  clubName?: string;
  danRank?: string;
  underage: boolean;
  guardiansEmail?: string;

  /* Internal properties */
  password: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

interface UserMethods {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  generatePasswordRecoveryToken: () => Promise<void>;
  isPasswordResetTokenExpired: () => boolean;
}

const omitEmptyString = (attribute: string): string | undefined =>
  attribute === "" ? undefined : attribute;

type UserModelType = mongoose.Model<User, Record<string, unknown>, UserMethods>;

const schema = new Schema<User, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      index: {
        name: "email_idx",
        unique: true,
        collation: { locale: "en", strength: 2 }
      }
    },
    userName: { type: String, set: omitEmptyString },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    inNationalTeam: { type: Boolean, default: false },
    nationality: { type: String, set: omitEmptyString },
    suomisportId: { type: String, set: omitEmptyString },
    clubName: { type: String, set: omitEmptyString },
    danRank: { type: String, set: omitEmptyString },
    underage: { type: Boolean, default: false },
    guardiansEmail: { type: String, set: omitEmptyString },

    /* Internal properties */
    password: { type: String, required: true, select: false },
    refreshToken: { type: String, required: false, select: false },
    resetPasswordToken: { type: String, required: false, select: false },
    resetPasswordExpires: { type: Date, required: false, select: false }
  },
  {
    timestamps: true
  }
);

// Omit the password when returning a user
schema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    if (doc.isSelected("password")) {
      delete ret.password;
    }
    ret.id = ret._id;
    delete ret._id;
  }
});

// Hash the password before saving
schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

schema.methods.checkPassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

schema.methods.generatePasswordRecoveryToken = async function () {
  this.resetPasswordToken = await bcrypt.hash(Date.now().toString(), 10);
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

schema.methods.isPasswordResetTokenExpired = function () {
  return Date.now() > this.resetPasswordExpires;
};

const UserModel = mongoose.model<User, UserModelType>("User", schema);

export default UserModel;

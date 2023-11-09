import mongoose, { Schema, type Types } from "mongoose";
import { UserRole } from "./requestModel";
import bcrypt from "bcryptjs";

export interface User {
  id: Types.ObjectId;
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  clubName: string;
  danRank: string;
  underage: boolean;
  guardiansEmail?: string;
  role: UserRole;
  refreshToken?: string;
}

interface UserMethods {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
}

type UserModel = mongoose.Model<User, Record<string, unknown>, UserMethods>;

const schema = new Schema<User, UserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    clubName: { type: String, required: true },
    danRank: { type: String, required: true },
    underage: { type: Boolean, default: false },
    guardiansEmail: { type: String },
    role: {
      type: Number,
      enum: UserRole,
      default: 0
    },
    refreshToken: { type: String, required: false, select: false }
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

// Method to compare passwords
schema.methods.checkPassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<User, UserModel>("User", schema);

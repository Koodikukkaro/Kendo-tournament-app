import mongoose, { Schema, type Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  id: Types.ObjectId;
  email: string;
  password: string;
  userName?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  nationality: string;
  inNationalTeam: boolean;
  clubName?: string;
  danRank?: string;
  underage: boolean;
  guardiansEmail?: string;
  refreshToken?: string;
}

interface UserMethods {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
}

type UserModelType = mongoose.Model<User, Record<string, unknown>, UserMethods>;

const schema = new Schema<User, UserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    userName: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nationality: { type: String, required: true },
    inNationalTeam: { type: Boolean, default: false },
    phoneNumber: { type: String, required: true },
    clubName: { type: String },
    danRank: { type: String },
    underage: { type: Boolean, default: false },
    guardiansEmail: { type: String },
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

// Method to compare passwords
schema.methods.checkPassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<User, UserModelType>("User", schema);

export default UserModel;

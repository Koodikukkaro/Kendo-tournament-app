import mongoose, { Schema } from "mongoose";

export interface User {
  id: string;
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  clubName: string;
  danRank: string;
  underage: boolean;
  guardiansEmail?: string;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    clubName: { type: String, required: true },
    danRank: { type: String, required: true },
    underage: { type: Boolean, default: false },
    guardiansEmail: { type: String }
  },
  {
    timestamps: true
  }
);

userSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    if (doc.isSelected("password")) {
      delete ret.password;
    }
    delete ret._id;
  }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

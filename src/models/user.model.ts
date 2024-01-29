import { model, Schema } from "mongoose";

import { EUserStatus } from "../enums";
import { IUser } from "../interfaces";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userStatus: {
      type: String,
      enum: EUserStatus,
      default: EUserStatus.INACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);

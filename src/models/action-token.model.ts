import { model, Schema, Types } from "mongoose";

import { EActionTokenType } from "../enums";
import { IActionToken } from "../interfaces";
import { User } from "./user.model";

const actionTokenSchema = new Schema(
  {
    actionToken: {
      type: String,
      required: true,
    },
    tokenType: {
      type: String,
      enum: EActionTokenType,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = model<IActionToken>(
  "actionToken",
  actionTokenSchema,
);

import { Document, Types } from "mongoose";

import { EActionTokenType } from "../enums";

export interface ITokenPayload {
  userId: string;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends ITokensPair, Document {
  _userId: Types.ObjectId;
}

export interface IActionToken extends Document {
  actionToken: string;
  tokenType: EActionTokenType;
  _userId: Types.ObjectId;
}

import { Document } from "mongoose";

import { EUserStatus } from "../enums";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  userStatus: EUserStatus;
}

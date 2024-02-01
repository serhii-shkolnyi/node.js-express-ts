import joi from "joi";

import { regexConstant } from "../constants";

export class UserValidator {
  private static userName = joi.string().min(3).max(20).trim();
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();
  private static email = joi
    .string()
    .regex(regexConstant.EMAIL)
    .lowercase()
    .trim();

  public static create = joi.object({
    email: this.email.required(),
    password: this.password.required(),
    userName: this.userName.required(),
  });

  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static forgotPassword = joi.object({
    email: this.email.required(),
  });

  public static setForgotPassword = joi.object({
    newPassword: this.password.required(),
  });
}

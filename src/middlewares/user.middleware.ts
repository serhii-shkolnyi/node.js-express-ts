import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { IUser } from "../interfaces";
import { userRepository } from "../repositories";

class UserMiddleware {
  public isUserExist(field: keyof IUser) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userRepository.getOneByParams({
          [field]: req.body[field],
        });

        if (!user) {
          throw new ApiError("User not found", 404);
        }

        req.res.locals = user;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();

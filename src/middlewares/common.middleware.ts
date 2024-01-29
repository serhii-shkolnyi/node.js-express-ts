import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiError } from "../errors";

class CommonMiddleware {
  public isBodyValid(validator: ObjectSchema) {
    return function (req: Request, res: Response, next: NextFunction) {
      try {
        const { value, error } = validator.validate(req.body);
        if (error) {
          throw new ApiError(error.details[0].message, 400);
        }

        req.body = value;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();

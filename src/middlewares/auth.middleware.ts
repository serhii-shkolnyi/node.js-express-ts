import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";

class AuthMiddleware {
  public isTokenExist(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.token;

      if (!token) {
        throw new ApiError("No token", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();

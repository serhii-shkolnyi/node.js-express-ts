import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces";
import { authService } from "../services";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Partial<IUser>;
      const createdUser = await authService.register(body);

      return res.json({ data: createdUser });
    } catch (e) {
      next(e);
    }
  }

  public async registerVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.token;

      await authService.registerVerify(token);

      return res.json("OK");
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();

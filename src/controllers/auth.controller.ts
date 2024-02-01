import { NextFunction, Request, Response } from "express";

import {
  IChangePassword,
  ILogin,
  IToken,
  ITokenPayload,
  IUser,
} from "../interfaces";
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

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ILogin;
      const jwtTokens = await authService.login(body);

      return res.json({ data: jwtTokens });
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.res.locals.jwtPayload as Partial<IToken>;

      await authService.logoutAll(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as string;

      const jwtTokens = await authService.refresh(jwtPayload, refreshToken);

      return res.json({ data: jwtTokens });
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals as IUser;

      await authService.forgotPassword(user);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const actionToken = req.params.token;
      const newPassword = req.body.newPassword;

      await authService.setForgotPassword(newPassword, actionToken);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const body = req.body as IChangePassword;

      await authService.changePassword(body, jwtPayload);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();

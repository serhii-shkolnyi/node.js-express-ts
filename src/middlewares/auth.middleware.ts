import { NextFunction, Request, Response } from "express";

import { ETokenType } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository } from "../repositories";
import { tokenService } from "../services";

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

  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const tokenString = req.get("Authorization");
      if (!tokenString) {
        throw new ApiError("No token", 401);
      }

      const accessToken = tokenString.split("Bearer ")[1];

      const jwtPayload = tokenService.checkToken(
        accessToken,
        ETokenType.ACCESS,
      );

      const entity = await tokenRepository.getTokenByParams({ accessToken });
      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }

      req.res.locals.jwtPayload = jwtPayload.userId;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const tokenString = req.get("Authorization");
      if (!tokenString) {
        throw new ApiError("No token", 401);
      }

      const refreshToken = tokenString.split("Bearer ")[1];

      const jwtPayload = tokenService.checkToken(
        refreshToken,
        ETokenType.REFRESH,
      );

      const entity = await tokenRepository.getTokenByParams({ refreshToken });
      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }

      req.res.locals.jwtPayload = jwtPayload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();

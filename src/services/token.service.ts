import * as jwt from "jsonwebtoken";

import { apiConfig } from "../configs";
import { ETokenType } from "../enums";
import { ApiError } from "../errors";
import { ITokenPayload, ITokensPair } from "../interfaces";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, apiConfig.JWT_ACCESS_SECRET, {
      expiresIn: apiConfig.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, apiConfig.JWT_REFRESH_SECRET, {
      expiresIn: apiConfig.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: ETokenType): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case ETokenType.ACCESS:
          secret = apiConfig.JWT_ACCESS_SECRET;
          break;
        case ETokenType.REFRESH:
          secret = apiConfig.JWT_REFRESH_SECRET;
          break;
        default:
          throw new ApiError("checkToken error", 500);
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid!", 401);
    }
  }
}

export const tokenService = new TokenService();

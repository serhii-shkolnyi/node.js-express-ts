import * as jwt from "jsonwebtoken";

import { apiConfig } from "../configs";
import { EActionTokenType } from "../enums";
import { ApiError } from "../errors";
import { ITokenPayload } from "../interfaces";

class ActionTokenService {
  public createActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenType,
  ) {
    let secret: string;

    switch (tokenType) {
      case EActionTokenType.ACTIVATE:
        secret = apiConfig.JWT_ACTION_ACTIVATE_SECRET;
        break;
      case EActionTokenType.FORGOT_PASSWORD:
        secret = apiConfig.JWT_ACTION_FORGOT_PASSWORD;
        break;
      default:
        throw new ApiError("createActionToken error", 500);
    }

    return jwt.sign(payload, secret, {
      expiresIn: apiConfig.JWT_ACTION_EXPIRES_IN,
    });
  }

  public checkActionToken(actionToken: string, type: EActionTokenType) {
    try {
      let secret: string;

      switch (type) {
        case EActionTokenType.ACTIVATE:
          secret = apiConfig.JWT_ACTION_ACTIVATE_SECRET;
          break;
        case EActionTokenType.FORGOT_PASSWORD:
          secret = apiConfig.JWT_ACTION_FORGOT_PASSWORD;
          break;
        default:
          throw new ApiError("checkActionToken error", 500);
      }

      return jwt.verify(actionToken, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const actionTokenService = new ActionTokenService();

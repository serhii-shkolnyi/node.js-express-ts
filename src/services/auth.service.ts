import { Types } from "mongoose";

import { EActionTokenType, EEmailAction, EUserStatus } from "../enums";
import { ApiError } from "../errors";
import {
  ILogin,
  IToken,
  ITokenPayload,
  ITokensPair,
  IUser,
} from "../interfaces";
import {
  actionTokenRepository,
  tokenRepository,
  userRepository,
} from "../repositories";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: Partial<IUser>): Promise<IUser> {
    const userFromDb = await userRepository.getOneByParams({
      email: dto.email,
    });
    if (userFromDb) {
      throw new ApiError("User with provided email already exists", 400);
    }

    const hashedPassword = await passwordService.hash(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const actionToken = actionTokenService.createActionToken(
      { userId: user._id },
      EActionTokenType.ACTIVATE,
    );

    await Promise.all([
      actionTokenRepository.createActionToken({
        actionToken,
        _userId: user._id,
        tokenType: EActionTokenType.ACTIVATE,
      }),
      emailService.sendMail(dto.email, EEmailAction.ACTIVATE, {
        userName: dto.userName,
        actionToken,
      }),
    ]);
    return user;
  }

  public async registerVerify(actionToken: string) {
    const payload = actionTokenService.checkActionToken(
      actionToken,
      EActionTokenType.ACTIVATE,
    );

    const entity = await actionTokenRepository.getActionTokenByParams({
      actionToken,
    });

    if (!entity) {
      throw new ApiError("Not valid token", 400);
    }

    const user = await userRepository.getOneByParams({ _id: entity._userId });

    await Promise.all([
      userRepository.updateById(payload.userId, {
        userStatus: EUserStatus.ACTIVE,
      }),
      actionTokenRepository.deleteActionTokenByParams({ actionToken }),
      emailService.sendMail(user.email, EEmailAction.WELCOME, {
        userName: user.userName,
      }),
    ]);
  }

  public async login(dto: ILogin): Promise<ITokensPair> {
    const user = await userRepository.getOneByParams({ email: dto.email });
    if (!user) {
      throw new ApiError("Not valid email or password", 401);
    }

    const isMatch = await passwordService.compare(dto.password, user.password);
    if (!isMatch) {
      throw new ApiError("Not valid email or password", 401);
    }

    if (user.userStatus !== "active") {
      throw new ApiError("Verify your account", 403);
    }

    const jwtTokens = tokenService.generateTokenPair({ userId: user._id });
    await tokenRepository.create({ ...jwtTokens, _userId: user._id });

    return jwtTokens;
  }

  public async logoutAll(dto: Partial<IToken>): Promise<void> {
    await tokenRepository.deleteManyByParams({ _userId: dto });
  }

  public async refresh(
    jwtPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });

    const jwtTokens = tokenService.generateTokenPair({
      userId: jwtPayload.userId,
    });
    await tokenRepository.create({
      ...jwtTokens,
      _userId: new Types.ObjectId(jwtPayload.userId),
    });

    return jwtTokens;
  }
}

export const authService = new AuthService();

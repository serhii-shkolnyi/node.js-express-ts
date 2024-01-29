import { EActionTokenType, EEmailAction, EUserStatus } from "../enums";
import { ApiError } from "../errors";
import { IUser } from "../interfaces";
import { actionTokenRepository, userRepository } from "../repositories";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";

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
}

export const authService = new AuthService();

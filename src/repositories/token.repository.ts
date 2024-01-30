import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces";
import { Token } from "../models";

class TokenRepository {
  public async create(data: Partial<IToken>) {
    return await Token.create(data);
  }

  public async getTokenByParams(
    params: FilterQuery<Partial<IToken>>,
  ): Promise<IToken> {
    return await Token.findOne(params);
  }

  public async deleteManyByParams(
    params: FilterQuery<Partial<IToken>>,
  ): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();

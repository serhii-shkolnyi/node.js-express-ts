import { FilterQuery } from "mongoose";

import { IActionToken } from "../interfaces";
import { ActionToken } from "../models";

class ActionTokenRepository {
  public async createActionToken(data: Partial<IActionToken>) {
    return await ActionToken.create(data);
  }

  public async getActionTokenByParams(
    params: FilterQuery<Partial<IActionToken>>,
  ) {
    return await ActionToken.findOne(params);
  }

  public async deleteActionTokenByParams(
    params: FilterQuery<Partial<IActionToken>>,
  ) {
    return await ActionToken.deleteOne(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();

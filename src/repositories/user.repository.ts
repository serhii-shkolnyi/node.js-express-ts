import { FilterQuery } from "mongoose";

import { IUser } from "../interfaces";
import { User } from "../models";

class UserRepository {
  public async create(body: Partial<IUser>): Promise<IUser> {
    return await User.create(body);
  }

  public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }

  public async updateById(id: string, body: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(id, body, { returnDocument: "after" });
  }
}

export const userRepository = new UserRepository();

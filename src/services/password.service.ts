import bcrypt from "bcrypt";

import { apiConfig } from "../configs";

class PasswordService {
  public hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(apiConfig.BCRYPT_SALT_ROUNDS));
  }

  public compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();

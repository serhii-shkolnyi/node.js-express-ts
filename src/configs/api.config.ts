import { config } from "dotenv";

config();

export const apiConfig = {
  FRONT_URL: process.env.FRONT_URL,

  PORT: process.env.PORT || 5001,

  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/node-mongo",

  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,

  JWT_ACTION_ACTIVATE_SECRET: process.env.JWT_ACTION_ACTIVATE_SECRET,
  JWT_ACTION_EXPIRES_IN: process.env.JWT_ACTION_EXPIRES_IN,

  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};

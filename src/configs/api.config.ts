import { config } from "dotenv";

config();

export const apiConfig = {
  PORT: process.env.PORT || 5001,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/node-mongo",
};

import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { apiConfig } from "./configs";
import { ApiError } from "./errors";
import { apiRouter } from "./routers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err?.status || 500).json({
      message: err?.message,
      status: err?.status,
    });
  },
);

app.listen(apiConfig.PORT, async () => {
  await mongoose.connect(apiConfig.DB_URI);
  console.log(`Server has successfully started on PORT ${apiConfig.PORT}`);
});

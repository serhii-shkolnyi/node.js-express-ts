import { Router } from "express";

import { authController } from "../controllers";
import { authMiddleware, commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.register,
);
router.put(
  "/register/verify/:token",
  authMiddleware.isTokenExist,
  authController.registerVerify,
);

router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);

router.post(
  "/logout",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

export const authRouter = router;

import { Router } from "express";

import { authController } from "../controllers";
import {
  authMiddleware,
  commonMiddleware,
  userMiddleware,
} from "../middlewares";
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

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  userMiddleware.isUserExist("email"),
  authController.forgotPassword,
);

router.put(
  "/forgot-password/:token",
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authController.setForgotPassword,
);

router.post(
  "/change-password",
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

export const authRouter = router;

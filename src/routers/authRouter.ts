import express from "express";
import passport from "../middlewares/passport";
import { AuthController } from "../controllers/authController";

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);
authRouter.post(
  "/refresh",
  passport.authenticate("refresh-token", { session: false }),
  authController.refreshTokens
);
authRouter.post(
  "/logout",
  passport.authenticate("access-token", { session: false }),
  authController.logout
);

export default authRouter;

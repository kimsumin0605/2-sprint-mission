import express from "express";
import passport from "../middlewares/passport";
import { AuthController } from "../controllers/authController";

const authController = new AuthController();
const authRouter = express.Router();

const authenticate = passport.authenticate("access-token", { session: false });

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authenticate, authController.refreshTokens);
authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;

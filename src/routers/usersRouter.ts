import express from "express";
import passport from "../middlewares/passport";
import { UserController } from "../controllers/userController";

const userRouter = express.Router();
const userController = new UserController();

userRouter.use(passport.authenticate("access-token", { session: false }));

userRouter.get("/me", userController.getMyInfo);
userRouter.patch("/me", userController.updateMyInfo);
userRouter.patch("/me/password", userController.changeUserPassword);

export default userRouter;

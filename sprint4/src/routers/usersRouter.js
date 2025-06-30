import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import passport from '../middlewares/passport.js';
import { getMyInfo, updateMyInfo, changePassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.use(passport.authenticate('access-token', { session: false }));

userRouter.get('/me', withAsync(getMyInfo));
userRouter.patch('/me', withAsync(updateMyInfo));
userRouter.patch('/me/password', withAsync(changePassword));

export default userRouter;
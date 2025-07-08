import express from 'express';
import { withAsync } from '../lib/withAsync';
import passport from '../middlewares/passport';
import { getMyInfo, updateMyInfo, changeUserPassword } from '../controllers/userController';

const userRouter = express.Router();

userRouter.use(passport.authenticate('access-token', { session: false }));

userRouter.get('/me', withAsync(getMyInfo));
userRouter.patch('/me', withAsync(updateMyInfo));
userRouter.patch('/me/password', withAsync(changeUserPassword));

export default userRouter;
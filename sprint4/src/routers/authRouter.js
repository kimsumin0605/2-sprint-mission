import express from 'express';
import passport from '../middlewares/passport.js';
import { register, login, logout, refreshTokens, } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', passport.authenticate('local', { session: false }), login);
authRouter.post('/refresh', passport.authenticate('refresh-token', { session: false }), refreshTokens);
authRouter.post('/logout', passport.authenticate('access-token', { session: false }), logout);

export default authRouter; 
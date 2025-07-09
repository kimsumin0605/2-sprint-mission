import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import prisma from '../lib/prismaClient.js';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: '등록된 이메일이 없습니다' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: '비밀번호가 틀렸습니다.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'access-token',
  new JwtStrategy(
    {
      jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'refresh-token',
  new JwtStrategy(
    {
      jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
      secretOrKey: JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });

        const refreshTokenInCookie = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
        if (!user || user.refreshToken !== refreshTokenInCookie) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
export default passport;

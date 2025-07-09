import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import bcrypt from 'bcrypt';
import prisma from '../lib/prismaClient';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants';
import { Request } from 'express';

// JWT payload 타입 정의
interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
}

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
        return done(err as Error);
      }
    }
  )
);

passport.use(
  'access-token',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[ACCESS_TOKEN_COOKIE_NAME]
      ]),
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    },
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.use(
  'refresh-token',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[REFRESH_TOKEN_COOKIE_NAME]
      ]),
      secretOrKey: JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    },
    async (
      req: Request,
      payload: JwtPayload,
      done: VerifiedCallback
    ) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || user.refreshToken !== req.cookies[REFRESH_TOKEN_COOKIE_NAME]) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;

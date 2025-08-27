import type { User as PrismaUser } from '@prisma/client';

type SafeUser = Pick<PrismaUser, 'id' | 'email' | 'nickname' | 'createdAt' | 'updatedAt'>;

declare global {
  namespace Express {
    interface User extends SafeUser {
      password: string;
      refreshToken?: string | null;
      iat?: number;
      exp?: number;
    }
    interface Request {
      user?: User;
    }
  }
}

export { };
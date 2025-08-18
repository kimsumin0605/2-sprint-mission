import { userRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/token';
import { setTokenCookies, clearTokenCookies } from '../utils/cookie';
import { ConflictError } from '../lib/errors/BadRequestError';
import { Response } from 'express'

interface RegisterUserInput {
  email: string;
  nickname: string;
  password: string;
}

export async function registerUser({ email, nickname, password }: RegisterUserInput) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('이미 가입된 이메일입니다');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    email,
    nickname,
    password: hashedPassword,
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
}

export function generateAuthTokens(userId: number) {
  return generateTokens(userId);
}

export function setTokensInCookies(res: Response, accessToken: string, refreshToken: string) {
  return setTokenCookies(res, accessToken, refreshToken);
}

export function clearTokensFromCookies(res: Response) {
  return clearTokenCookies(res);
}

import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/token.js';
import { setTokenCookies, clearTokenCookies } from '../utils/cookie.js';

export async function registerUser({ email, nickname, password }) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('이미 가입된 이메일입니다.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    email,
    nickname,
    password: hashedPassword,
  });

  return user;
}

export async function loginUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
}

export function generateAuthTokens(userId) {
  return generateTokens(userId);
}

export function setTokensInCookies(res, accessToken, refreshToken) {
  setTokenCookies(res, accessToken, refreshToken);
}

export function clearTokensFromCookies(res) {
  clearTokenCookies(res);
}

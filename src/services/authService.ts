import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { generateTokens } from "../utils/token";
import { setTokenCookies, clearTokenCookies } from "../utils/cookie";
import { ConflictError } from "../lib/errors/BadRequestError";
import { Response } from "express";

const userRepository = new UserRepository();

export class AuthService {
  async registerUser(data: {
    email: string;
    nickname: string;
    password: string;
  }) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new ConflictError("이미 가입된 이메일입니다");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.createUser({
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  generateAuthTokens(userId: number) {
    return generateTokens(userId);
  }

  async logoutUser(userId: number) {
    await userRepository.updateUser(userId, { refreshToken: undefined });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await userRepository.updateUser(userId, { refreshToken });
  }

  setTokensInCookies(res: Response, accessToken: string, refreshToken: string) {
    setTokenCookies(res, accessToken, refreshToken);
  }

  clearTokensFromCookies(res: Response) {
    clearTokenCookies(res);
  }
}

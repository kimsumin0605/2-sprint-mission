import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { generateTokens } from "../utils/token";
import { setTokenCookies, clearTokenCookies } from "../utils/cookie";
import { ConflictError, UnauthorizedError, BadRequestError } from "../lib/errors/BadRequestError";
import { Response } from "express";

const userRepository = new UserRepository();

export class AuthService {
  async registerUser(data: { email: string; nickname: string; password: string }) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("이미 가입된 이메일입니다");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.createUser({
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestError("이메일과 비밀번호는 필수 항목입니다.");
    }
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedError("잘못된 이메일 또는 비밀번호입니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("잘못된 이메일 또는 비밀번호입니다.");
    }

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

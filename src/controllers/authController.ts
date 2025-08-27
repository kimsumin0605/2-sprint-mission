import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { AuthService } from "../services/authService";
import { RegisterUserDto, LoginUserDto } from "../dtos/auth.dto";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const dto = plainToInstance(RegisterUserDto, req.body);
    await validateOrReject(dto);

    const user = await authService.registerUser(dto);
    const { password, ...safeUser } = user;

    res.status(201).json(safeUser);
  }

  async login(req: Request, res: Response) {
    const dto = plainToInstance(LoginUserDto, req.body);
    await validateOrReject(dto);

    const user = await authService.loginUser(dto.email, dto.password);
    if (!user) {
      return res
        .status(401)
        .json({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const { accessToken, refreshToken } = authService.generateAuthTokens(
      user.id
    );
    await authService.updateRefreshToken(user.id, refreshToken);
    authService.setTokensInCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "로그인 성공",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async logout(req: Request, res: Response) {
    if (req.user) {
      await authService.logoutUser(req.user.id);
    }

    authService.clearTokensFromCookies(res);
    return res.status(200).json({ message: "로그아웃 완료" });
  }

  async refreshTokens(req: Request, res: Response) {
    const user = req.user!;
    const currentRefresh = req.cookies["refresh-token"];

    if (user.refreshToken !== currentRefresh) {
      return res
        .status(401)
        .json({ message: "유효하지 않은 refresh-token입니다." });
    }

    const { accessToken, refreshToken } = authService.generateAuthTokens(
      user.id
    );
    await authService.updateRefreshToken(user.id, refreshToken);
    authService.setTokensInCookies(res, accessToken, refreshToken);

    return res.status(200).json({ message: "토큰 재발급 완료" });
  }
}

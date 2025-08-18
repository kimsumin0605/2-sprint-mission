import * as authService from '../services/authService';
import { RegisterUserStruct } from '../structs/authStructs';
import { create } from 'superstruct';
import { userRepository } from '../repositories/userRepository';
import { withAsync } from '../lib/withAsync';
import { Request, Response } from 'express';
import { requireUser } from '../lib/assertUser';

interface StructValidationError extends Error {
  code?: string;
}

export const register = withAsync(async (req: Request, res: Response) => {
  try {
    const data = create(req.body, RegisterUserStruct);
    const user = await authService.registerUser(data);
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err: unknown) {
    const error = err as StructValidationError
    if (error.code === 'STRUCT_VALIDATION_FAILED') {
      res.status(400).json({
        message: '입력하신 정보의 형식이 올바르지 않습니다. 다시 확인해 주세요.',
      });
      return;
    }
    throw err;
  }
});

export const login = withAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: '이메일 또는 비밀번호가 입력되지 않았습니다' });
    return;
  }

  const user = await authService.loginUser(email, password);

  if (!user) {
    res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    return;
  }

  const { accessToken, refreshToken } = authService.generateAuthTokens(user.id);
  await userRepository.updateUser(user.id, { refreshToken });

  authService.setTokensInCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: '로그인 성공' });
  return;
});

export const logout = withAsync(async (req: Request, res: Response) => {
  if (req.user) {
    await userRepository.updateUser(req.user.id, { refreshToken: null });
  }

  authService.clearTokensFromCookies(res);
  res.status(200).json({ message: '로그아웃 완료' });
  return;
});

export const refreshTokens = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const currentRefresh = req.cookies['refresh-token'];

  if (user.refreshToken !== currentRefresh) {
    res.status(401).json({ message: '유효하지 않은 refresh-token입니다.' });
    return;
  }
  const { accessToken, refreshToken } = authService.generateAuthTokens(user.id);
  await userRepository.updateUser(user.id, { refreshToken });

  authService.setTokensInCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: '토큰 재발급 완료' });
  return;
});
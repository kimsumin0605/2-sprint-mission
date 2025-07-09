import * as authService from '../services/authService.js';
import { RegisterUserStruct } from '../structs/authStructs.js';
import { create } from 'superstruct';
import { userRepository } from '../repositories/userRepository.js';
import { withAsync } from '../lib/withAsync.js';

export const register = withAsync(async (req, res, next) => {
  try {
    const data = create(req.body, RegisterUserStruct);
    const user = await authService.registerUser(data);
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    if (err.code === 'STRUCT_VALIDATION_FAILED') {
      return res.status(400).json({
        message: '입력하신 정보의 형식이 올바르지 않습니다. 다시 확인해 주세요.',
      });
    }
    throw err;
  }
});

export const login = withAsync(async (req, res) => {
  const{email , password} = req.user;

  const user = await authService.loginUser(email, password);
  if (!user) {
    return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다. 아이디와 비밀번호를 정확히 입력해 주세요.' });
  }

  const { accessToken, refreshToken } = authService.generateAuthTokens(user.id);
  await userRepository.updateUser(user.id, { refreshToken });

  authService.setTokensInCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: '로그인 성공' });
});

export const logout = withAsync(async (req, res) => {
  if (req.user) {
    await userRepository.updateUser(req.user.id, { refreshToken: null });
  }

  authService.clearTokensFromCookies(res);
  res.status(200).json({ message: '로그아웃 완료' });
});

export const refreshTokens = withAsync(async (req, res) => {
  const user = req.user;
  const currentRefresh = req.cookies['refresh-token'];

  if (user.refreshToken !== currentRefresh) {
    return res.status(401).json({ message: '유효하지 않은 refresh-token입니다.' });
  }
  const { accessToken, refreshToken } = authService.generateAuthTokens(user.id);
  await userRepository.updateUser(user.id, { refreshToken });

  authService.setTokensInCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: '토큰 재발급 완료' });
});
import {
  getMeService,
  updateUserService,
  changePasswordService,
} from '../services/userService.js';
import { withAsync } from '../lib/withAsync.js';

export const getMyInfo = withAsync(async (req, res) => {
  const user = await getMeService(req.user.id);
  res.status(200).json(user);
});

export const updateMyInfo = withAsync(async (req, res) => {
  const user = await updateUserService(req.user.id, req.body);
  res.status(200).json(user);
});

export const changePassword = withAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changePasswordService(req.user.id, currentPassword, newPassword);
  res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
});

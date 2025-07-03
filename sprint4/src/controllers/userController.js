import {
  getMe,
  updateUser,
  changePassword,
} from '../services/userService.js';
import { withAsync } from '../lib/withAsync.js';
import { ChangePasswordStruct } from '../structs/authStructs.js';

export const getMyInfo = withAsync(async (req, res) => {
  const user = await getMe(req.user.id);
  res.status(200).json(user);
});

export const updateMyInfo = withAsync(async (req, res) => {
  const { nickname, image } = req.body;
  const user = await updateUser(req.user.id, { nickname, image });
  res.status(200).json(user);
});

export const changeUserPassword = withAsync(async (req, res) => {
  const { currentPassword, newPassword } = create(req.body, ChangePasswordStruct);
  await changePassword(req.user.id, currentPassword, newPassword);
  res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
});

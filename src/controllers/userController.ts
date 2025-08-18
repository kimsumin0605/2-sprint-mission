import {
  getMe,
  updateUser,
  changePassword,
} from '../services/userService';
import { withAsync } from '../lib/withAsync';
import { ChangePasswordStruct, UpdateUserStruct } from '../structs/authStructs';
import { Response, Request } from 'express';
import { create } from 'superstruct';
import { requireUser } from '../lib/assertUser';

export const getMyInfo = withAsync(async (req: Request, res: Response) => {
  const newUser = requireUser(req);
  const user = await getMe(newUser.id);
  res.status(200).json(user);
});

export const updateMyInfo = withAsync(async (req: Request, res: Response) => {
  const currentUser = requireUser(req);
  const updateData = create(req.body, UpdateUserStruct);
  const updatedUser = await updateUser(currentUser.id, updateData);
  res.status(200).json(updatedUser);
});

export const changeUserPassword = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { currentPassword, newPassword } = create(req.body, ChangePasswordStruct);
  await changePassword(user.id, currentPassword, newPassword);
  res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
});

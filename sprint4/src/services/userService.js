import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export async function getMeService(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User', userId);

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function updateUserService(userId, updateData) {
  const updatedUser = await userRepository.updateUser(userId, updateData);
  const { password, ...safeUser } = updatedUser;
  return safeUser;
}

export async function changePasswordService(userId, currentPassword, newPassword) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('유저', userId);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new BadRequestError('기존 비밀번호가 일치하지 않습니다.');

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUser(userId, { password: hashed });
}

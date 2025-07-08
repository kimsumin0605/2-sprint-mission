import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { BadRequestError } from '../lib/errors/BadRequestError';
import { Prisma } from '@prisma/client';

export async function getMe(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User', userId);

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function updateUser(userId: number, updateData: Prisma.UserUpdateInput) {
  const updatedUser = await userRepository.updateUser(userId, updateData);
  const { password, ...safeUser } = updatedUser;
  return safeUser;
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('유저', userId);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new BadRequestError('기존 비밀번호가 일치하지 않습니다.');

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUser(userId, { password: hashed });
}

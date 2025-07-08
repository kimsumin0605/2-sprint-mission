import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

interface CreateUserInput {
  email: string;
  nickname: string;
  password: string;

}

export async function createUser(user: CreateUserInput) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
export const userRepository = {
  findById,
  findByEmail,
  createUser,
  updateUser,
};



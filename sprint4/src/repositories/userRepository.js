import prisma from '../lib/prismaClient.js';

export async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser({ email, nickname, password }) {
  return prisma.user.create({
    data: {
      email,
      nickname,
      password, 
    },
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
export const userRepository =  {
  findById,
  findByEmail,
  createUser,
  updateUser, 
};



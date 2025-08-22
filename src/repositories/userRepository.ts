import prisma from "../lib/prismaClient";
import { UserUpdateInput } from "../dtos/user.dto";
export class UserRepository {
  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    nickname: string;
    password: string;
  }) {
    return prisma.user.create({ data });
  }

  async updateUser(id: number, data: UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }
}

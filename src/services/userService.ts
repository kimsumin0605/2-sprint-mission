import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import { BadRequestError } from "../lib/errors/BadRequestError";

const userRepository = new UserRepository();

export class UserService {
  async getMe(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("유저", userId);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(
    userId: number,
    updateData: { nickname?: string; image?: string }
  ) {
    const updatedUser = await userRepository.updateUser(userId, updateData);
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("유저", userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestError("기존 비밀번호가 일치하지 않습니다.");

    const hashed = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUser(userId, { newpassword: hashed });
  }
}

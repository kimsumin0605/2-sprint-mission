import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UpdateUserDto, ChangePasswordDto } from "../dtos/user.dto";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async getMyInfo(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    const result = await userService.getMe(user.id);
    return res.status(200).json(result);
  }

  async updateMyInfo(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    const dto = plainToInstance(UpdateUserDto, req.body);
    await validateOrReject(dto);

    const result = await userService.updateUser(user.id, dto);
    return res.status(200).json(result);
  }

  async changeUserPassword(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    const dto = plainToInstance(ChangePasswordDto, req.body);
    await validateOrReject(dto);

    await userService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword
    );
    return res.status(200).json({ message: "비밀번호가 변경되었습니다." });
  }
}

import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    const userId = req.user!.id;
    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  }

  async getUnreadCount(req: Request, res: Response) {
    const userId = req.user!.id;
    const count = await notificationService.getUnreadCount(userId);
    res.json({ unreadCount: count });
  }

  async markAsRead(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    await notificationService.markAsRead(id, userId);
    res.json({ message: "알림을 읽음 처리했습니다." });
  }
}

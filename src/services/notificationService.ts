import { notificationRepository } from "../repositories/notificationRepository";
import { sendNotificationToUser } from "../socket/socket.service";
import { NotificationPayload } from "../dtos/notification.dto";

export class NotificationService {
  async createNotification(userId: number, payload: NotificationPayload) {
    await notificationRepository.create({
      userId,
      type: payload.type,
      message: payload.message,
      data: payload.data,
    });

    sendNotificationToUser(userId, payload);
  }

  async getNotifications(userId: number) {
    return notificationRepository.findAllByUserId(userId);
  }

  async getUnreadCount(userId: number) {
    return notificationRepository.countUnread(userId);
  }

  async markAsRead(notificationId: number, userId: number) {
    return notificationRepository.markAsRead(notificationId, userId);
  }
}

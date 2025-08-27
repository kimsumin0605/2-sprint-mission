import prisma from "../lib/prismaClient";

export const notificationRepository = {
  create: async ({ userId, type, message, data }: any) => {
    return prisma.notification.create({
      data: {
        userId,
        type,
        message,
        data: data ? JSON.stringify(data) : undefined,
      },
    });
  },

  findAllByUserId: async (userId: number) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  countUnread: async (userId: number) => {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  markAsRead: async (id: number, userId: number) => {
    return prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  },
};

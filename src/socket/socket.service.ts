import { io } from './socket';

export function sendNotificationToUser(userId: number, notification: any) {
  const room = `user_${userId}`;
  io.to(room).emit('notification', notification);
  console.log(`Sent notification to ${room}:`, notification);
}

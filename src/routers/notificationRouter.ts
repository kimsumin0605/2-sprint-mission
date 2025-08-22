import express from "express";
import { NotificationController } from "../controllers/notificationController";
import { verifyAccessToken } from "../middlewares/passport";

const notificationRouter = express.Router();
const notificationController = new NotificationController();

notificationRouter.use(verifyAccessToken);

notificationRouter.get("/", notificationController.getNotifications);
notificationRouter.get("/unread-count", notificationController.getUnreadCount);
notificationRouter.patch("/:id/read", notificationController.markAsRead);

export default notificationRouter;

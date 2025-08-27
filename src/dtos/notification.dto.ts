export type NotificationType = "COMMENT" | "PRICE_CHANGE";

export interface NotificationPayload {
  type: NotificationType;
  message: string;
  data?: string | Record<string, unknown>;
}

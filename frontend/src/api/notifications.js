import apiClient from "./client";

export const getMyNotifications = () => apiClient.get("/notifications/mine");

export const markNotificationRead = (notificationId) =>
  apiClient.patch(`/notifications/${encodeURIComponent(notificationId)}/read`);

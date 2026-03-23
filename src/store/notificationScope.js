const ADMIN_NOTIFICATION_PREFIXES = [
  "admin_",
  "career_",
  "charity_",
  "contact_",
];

const normalizeText = (value) => String(value || "").trim().toLowerCase();

export const isAdminNotification = (notification = {}) => {
  const type = normalizeText(notification.type);
  if (ADMIN_NOTIFICATION_PREFIXES.some((prefix) => type.startsWith(prefix))) {
    return true;
  }

  const title = normalizeText(notification.title);
  const message = normalizeText(notification.message);

  return (
    title.startsWith("charity ") ||
    title.startsWith("contact ") ||
    message.includes('charity "') ||
    message.includes("contact from ") ||
    message.includes("application from ")
  );
};

export const normalizeNotificationPayload = (payload = {}) => {
  const rawNotifications = Array.isArray(payload?.notifications)
    ? payload.notifications
    : Array.isArray(payload)
      ? payload
      : [];

  const notifications = rawNotifications.filter(
    (notification) => !isAdminNotification(notification)
  );

  return {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read).length,
  };
};

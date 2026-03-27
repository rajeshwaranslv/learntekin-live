export const requestBrowserNotifPermission = async () => {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
};

export const showBrowserNotif = (title, body, { tag = "ltin-notif", icon = "/assets/img/favicon-32x32.png" } = {}) => {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return;

  const notif = new Notification(title, { body, icon, badge: icon, tag, silent: true });
  notif.onclick = () => { window.focus(); notif.close(); };
  setTimeout(() => { try { notif.close(); } catch (_) {} }, 7000);
};

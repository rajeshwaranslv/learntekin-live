const DEFAULT_ICON = "/favicon-32x32.png";

const canUseBrowserNotifications = () =>
  typeof window !== "undefined" && typeof Notification !== "undefined";

export const requestBrowserNotifPermission = async () => {
  if (!canUseBrowserNotifications()) {
    return "denied";
  }

  if (Notification.permission !== "default") {
    return Notification.permission;
  }

  return Notification.requestPermission();
};

const buildOptions = ({ body, tag, icon, data, silent }) => ({
  body,
  icon: icon || DEFAULT_ICON,
  badge: icon || DEFAULT_ICON,
  tag,
  data,
  renotify: true,
  silent: Boolean(silent),
});

export const showBrowserNotif = async (
  title,
  body,
  {
    tag = "ltin-notif",
    icon = DEFAULT_ICON,
    data = {},
    silent = true,
    onlyWhenHidden = false,
  } = {}
) => {
  if (!canUseBrowserNotifications()) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  if (onlyWhenHidden && document.visibilityState === "visible") {
    return false;
  }

  const options = buildOptions({ body, tag, icon, data, silent });

  try {
    const registration = await navigator.serviceWorker?.getRegistration?.();
    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return true;
    }
  } catch (_) {
    // Fall through to the in-page Notification API.
  }

  try {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    setTimeout(() => {
      try {
        notification.close();
      } catch (_) {
        // Ignore notification close errors.
      }
    }, 7000);
    return true;
  } catch (_) {
    return false;
  }
};

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "../../store/notificationActions";
import { useNotifStream } from "../../utils/useNotifStream";
import { playNotifSound } from "../../utils/notifSound";
import { showBrowserNotif, requestBrowserNotifPermission } from "../../utils/browserNotif";

const TYPE_ICON = {
  charity_created:                  "bi-plus-circle-fill",
  charity_updated:                  "bi-pencil-fill",
  charity_deleted:                  "bi-trash-fill",
  internship_application_submitted: "bi-send-check-fill",
  internship_status_updated:        "bi-arrow-repeat",
  internship_certificate_ready:     "bi-patch-check-fill",
  internship_certificate_sent:      "bi-envelope-check-fill",
  certificate_new:                  "bi-patch-check-fill",
};

const TYPE_COLOR = {
  charity_created:                  "#1a8745",
  charity_updated:                  "#e69a00",
  charity_deleted:                  "#c0392b",
  internship_application_submitted: "#2563eb",
  internship_status_updated:        "#7c3aed",
  internship_certificate_ready:     "#059669",
  internship_certificate_sent:      "#1d4ed8",
  certificate_new:                  "#1a8745",
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const FALLBACK_POLL = 5 * 60 * 1000;
const REALTIME_REFRESH_DELAY = 500;
const persistNotifPreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (_error) {
    // Ignore storage failures in restricted browser contexts.
  }
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem("ltin_notif_sound") !== "off"; } catch { return true; }
  });
  const [browserNotifOn, setBrowserNotifOn] = useState(() => {
    try { return localStorage.getItem("ltin_browser_notif") === "on"; } catch { return false; }
  });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches
  );
  const panelRef = useRef(null);
  const wrapRef  = useRef(null);
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Initial fetch + fallback polling
  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), FALLBACK_POLL);
    return () => {
      clearInterval(interval);
      clearTimeout(refreshTimerRef.current);
    };
  }, [dispatch]);

  const scheduleRefresh = useCallback(() => {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      dispatch(fetchNotifications());
    }, REALTIME_REFRESH_DELAY);
  }, [dispatch]);

  // SSE real-time handler
  const handleNewNotif = useCallback((notif) => {
    scheduleRefresh();
    if (soundOn) playNotifSound(notif.type);
    if (browserNotifOn) {
      void showBrowserNotif(notif.title, notif.message, {
        tag: `ltin-live-${notif.type}`,
      });
    }
  }, [browserNotifOn, scheduleRefresh, soundOn]);

  useNotifStream("learntekin-live", handleNewNotif);

  // Toggle browser notification permission
  const toggleBrowserNotif = async () => {
    if (!browserNotifOn) {
      const perm = await requestBrowserNotifPermission();
      if (perm !== "granted") return;
    }
    const next = !browserNotifOn;
    setBrowserNotifOn(next);
    persistNotifPreference("ltin_browser_notif", next ? "on" : "off");
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    persistNotifPreference("ltin_notif_sound", next ? "on" : "off");
  };

  // Close on outside click (desktop only)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        wrapRef.current && !wrapRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile]);

  const handleItemClick = (id, read) => {
    const item = items.find((n) => n._id === id);
    if (!read) dispatch(markNotificationRead(id, item?.source));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const item = items.find((n) => n._id === id);
    dispatch(deleteNotificationById(id, item?.source));
  };

  const panel = open ? (
    <>
      {isMobile && (
        <div className="ltin-notif-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <div className="ltin-notif-panel" ref={panelRef}>
        <div className="ltin-notif-header">
          <span className="ltin-notif-title">Notifications</span>
          <div className="ltin-notif-header-actions">
            {/* Sound toggle */}
            <button
              className={`ltin-notif-icon-btn${soundOn ? " active" : ""}`}
              onClick={toggleSound}
              title={soundOn ? "Sound on" : "Sound off"}
              type="button"
              aria-label="Toggle notification sound"
            >
              <i className={`bi ${soundOn ? "bi-volume-up-fill" : "bi-volume-mute-fill"}`} />
            </button>
            {/* Browser notification toggle */}
            <button
              className={`ltin-notif-icon-btn${browserNotifOn ? " active" : ""}`}
              onClick={toggleBrowserNotif}
              title={browserNotifOn ? "Browser alerts on" : "Browser alerts off"}
              type="button"
              aria-label="Toggle browser notifications"
            >
              <i className={`bi ${browserNotifOn ? "bi-bell-fill" : "bi-bell-slash"}`} />
            </button>
            {unreadCount > 0 && (
              <button
                className="ltin-notif-markall"
                onClick={() => dispatch(markAllNotificationsRead())}
                type="button"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="ltin-notif-body">
          {items.length === 0 ? (
            <div className="ltin-notif-empty">
              <i className="bi bi-bell-slash" />
              <p>No notifications yet</p>
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n._id}
                className={`ltin-notif-item${n.read ? "" : " unread"}`}
                onClick={() => handleItemClick(n._id, n.read)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleItemClick(n._id, n.read)}
              >
                <span className="ltin-notif-icon" style={{ color: TYPE_COLOR[n.type] || "#555" }}>
                  <i className={`bi ${TYPE_ICON[n.type] || "bi-bell"}`} />
                </span>
                <div className="ltin-notif-content">
                  <p className="ltin-notif-item-title">{n.title}</p>
                  <p className="ltin-notif-item-msg">{n.message}</p>
                  <span className="ltin-notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                <button
                  className="ltin-notif-del"
                  onClick={(e) => handleDelete(e, n._id)}
                  aria-label="Delete"
                  type="button"
                >
                  <i className="bi bi-x" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="ltin-notif-wrap" ref={wrapRef}>
      <button
        className={`ltin-notif-btn${open ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        type="button"
      >
        <i className={`bi ${open ? "bi-bell-fill" : "bi-bell"}`} />
        {unreadCount > 0 && (
          <span className="ltin-notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>
      {isMobile ? ReactDOM.createPortal(panel, document.body) : panel}
    </div>
  );
};

export default NotificationBell;

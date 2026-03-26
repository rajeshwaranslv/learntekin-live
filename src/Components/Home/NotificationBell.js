import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "../../store/notificationActions";

const TYPE_ICON = {
  charity_created: "bi-plus-circle-fill",
  charity_updated: "bi-pencil-fill",
  charity_deleted: "bi-trash-fill",
  internship_application_submitted: "bi-send-check-fill",
  internship_status_updated: "bi-arrow-repeat",
  internship_certificate_ready: "bi-patch-check-fill",
  internship_certificate_sent: "bi-envelope-check-fill",
  certificate_new: "bi-patch-check-fill",
};

const TYPE_COLOR = {
  charity_created: "#1a8745",
  charity_updated: "#e69a00",
  charity_deleted: "#c0392b",
  internship_application_submitted: "#2563eb",
  internship_status_updated: "#7c3aed",
  internship_certificate_ready: "#059669",
  internship_certificate_sent: "#1d4ed8",
  certificate_new: "#1a8745",
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

const POLL_INTERVAL = 30000;

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches
  );
  const panelRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!open || isMobile) return;
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        wrapRef.current && !wrapRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, isMobile]);

  const handleItemClick = (id, read) => {
    const item = items.find((notification) => notification._id === id);
    if (!read) dispatch(markNotificationRead(id, item?.source));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const item = items.find((notification) => notification._id === id);
    dispatch(deleteNotificationById(id, item?.source));
  };

  const panel = open ? (
    <>
      {isMobile && (
        <div
          className="ltin-notif-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="ltin-notif-panel" ref={panelRef}>
          <div className="ltin-notif-header">
            <span className="ltin-notif-title">Notifications</span>
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
                  <span
                    className="ltin-notif-icon"
                    style={{ color: TYPE_COLOR[n.type] || "#555" }}
                  >
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

      {isMobile
        ? ReactDOM.createPortal(panel, document.body)
        : panel}
    </div>
  );
};

export default NotificationBell;

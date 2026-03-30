import { useCallback, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { buildApiUrl, buildWebSocketUrl } from "./api";

const MAX_RETRIES = 5;
const MAX_BACKOFF_MS = 30000;
const RECENT_EVENT_WINDOW_MS = 10000;
const FIRESTORE_LIMIT = 50;

const normalizeTimestamp = (value) => {
  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }
  return String(value || new Date().toISOString());
};

const normalizeNotification = (value) => ({
  _id: String(value?._id || value?.id || value?.entityId || ""),
  app: String(value?.app || "").trim(),
  type: String(value?.type || "notification").trim(),
  title: String(value?.title || "Notification").trim(),
  message: String(value?.message || "").trim(),
  recipientEmail: String(value?.recipientEmail || "")
    .trim()
    .toLowerCase(),
  entityId: String(value?.entityId || "").trim(),
  entityName: String(value?.entityName || "").trim(),
  read: Boolean(value?.read),
  createdAt: normalizeTimestamp(value?.createdAt),
  updatedAt: normalizeTimestamp(value?.updatedAt || value?.createdAt),
  metadata: value?.metadata || {},
});

const notificationKey = (notification) =>
  notification._id ||
  [
    notification.app,
    notification.type,
    notification.entityId,
    notification.recipientEmail,
    notification.createdAt,
    notification.title,
  ].join("|");

const normalizeFirestoreDoc = (docSnapshot) =>
  normalizeNotification({
    _id: docSnapshot.id,
    ...docSnapshot.data(),
  });

export const useNotifStream = (app, onNotification, options = {}) => {
  const {
    delayMs = 400,
    watchFirestore = true,
    filterNotification,
  } = options;

  const esRef = useRef(null);
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const retriesRef = useRef(0);
  const hasWorkingWsRef = useRef(false);
  const callbackRef = useRef(onNotification);
  const filterRef = useRef(filterNotification);
  const seenRef = useRef(new Map());
  const timeoutsRef = useRef(new Set());

  callbackRef.current = onNotification;
  filterRef.current = filterNotification;

  const scheduleCallback = useCallback(
    (notification) => {
      const timeoutId = setTimeout(() => {
        timeoutsRef.current.delete(timeoutId);
        callbackRef.current?.(notification);
      }, delayMs);
      timeoutsRef.current.add(timeoutId);
    },
    [delayMs]
  );

  const emitNotification = useCallback(
    (rawNotification) => {
      const notification = normalizeNotification(rawNotification);
      if (notification.app && notification.app !== app) {
        return;
      }
      if (!notification.app) {
        notification.app = app;
      }
      if (!notification.title && !notification.message) {
        return;
      }
      if (filterRef.current && !filterRef.current(notification)) {
        return;
      }

      const now = Date.now();
      for (const [key, timestamp] of seenRef.current.entries()) {
        if (now - timestamp > RECENT_EVENT_WINDOW_MS) {
          seenRef.current.delete(key);
        }
      }

      const key = notificationKey(notification);
      if (!key || seenRef.current.has(key)) {
        return;
      }

      seenRef.current.set(key, now);
      scheduleCallback(notification);
    },
    [app, scheduleCallback]
  );

  const closeSse = useCallback(() => {
    if (!esRef.current) {
      return;
    }
    try {
      esRef.current.close();
    } catch (_) {
      // Ignore close errors.
    }
    esRef.current = null;
  }, []);

  const closeWebSocket = useCallback(() => {
    if (!wsRef.current) {
      return;
    }
    try {
      wsRef.current.close();
    } catch (_) {
      // Ignore close errors.
    }
    wsRef.current = null;
  }, []);

  const scheduleReconnect = useCallback(
    (connect) => {
      clearTimeout(timerRef.current);
      const delay = Math.min(
        1000 * Math.pow(2, retriesRef.current),
        MAX_BACKOFF_MS
      );
      retriesRef.current = Math.min(retriesRef.current + 1, MAX_RETRIES);
      timerRef.current = setTimeout(connect, delay);
    },
    []
  );

  const connectSse = useCallback(() => {
    closeSse();

    const eventSource = new EventSource(
      buildApiUrl(`/api/notifications/stream?app=${encodeURIComponent(app)}`)
    );
    esRef.current = eventSource;

    eventSource.onopen = () => {
      retriesRef.current = 0;
    };

    eventSource.addEventListener("notification", (event) => {
      try {
        emitNotification(JSON.parse(event.data));
      } catch (_) {
        // Ignore malformed SSE payloads.
      }
    });

    eventSource.onerror = () => {
      closeSse();
      scheduleReconnect(connectSse);
    };
  }, [app, closeSse, emitNotification, scheduleReconnect]);

  const connectWebSocket = useCallback(() => {
    if (typeof WebSocket === "undefined") {
      connectSse();
      return;
    }

    closeWebSocket();

    let opened = false;

    try {
      const socket = new WebSocket(
        buildWebSocketUrl(`/api/notifications/ws?app=${encodeURIComponent(app)}`)
      );
      wsRef.current = socket;

      socket.onopen = () => {
        opened = true;
        hasWorkingWsRef.current = true;
        retriesRef.current = 0;
        closeSse();
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          emitNotification(payload?.notification || payload?.data || payload);
        } catch (_) {
          // Ignore malformed websocket payloads.
        }
      };

      socket.onerror = () => {
        if (!opened && !hasWorkingWsRef.current) {
          connectSse();
        }
      };

      socket.onclose = () => {
        wsRef.current = null;

        if (!opened && !hasWorkingWsRef.current) {
          connectSse();
          return;
        }

        connectSse();
        scheduleReconnect(connectWebSocket);
      };
    } catch (_) {
      connectSse();
    }
  }, [app, closeSse, closeWebSocket, connectSse, emitNotification, scheduleReconnect]);

  useEffect(() => {
    const trackedTimeouts = timeoutsRef.current;
    connectWebSocket();

    return () => {
      clearTimeout(timerRef.current);
      closeSse();
      closeWebSocket();
      for (const timeoutId of trackedTimeouts) {
        clearTimeout(timeoutId);
      }
      trackedTimeouts.clear();
    };
  }, [closeSse, closeWebSocket, connectWebSocket]);

  useEffect(() => {
    if (!watchFirestore) {
      return undefined;
    }

    let isInitialSnapshot = true;
    const unsubscribe = db
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(FIRESTORE_LIMIT)
      .onSnapshot(
        (snapshot) => {
          if (isInitialSnapshot) {
            isInitialSnapshot = false;
            snapshot.docs.forEach((docSnapshot) => {
              const notification = normalizeFirestoreDoc(docSnapshot);
              seenRef.current.set(notificationKey(notification), Date.now());
            });
            return;
          }

          snapshot.docChanges().forEach((change) => {
            if (change.type !== "added") {
              return;
            }

            const notification = normalizeFirestoreDoc(change.doc);
            const currentEmail = String(auth.currentUser?.email || "")
              .trim()
              .toLowerCase();
            const matchesRecipient =
              !notification.recipientEmail ||
              notification.recipientEmail === currentEmail;

            if (notification.app === app && matchesRecipient) {
              emitNotification(notification);
            }
          });
        },
        () => {
          // Keep the stream transports alive even if Firestore listening fails.
        }
      );

    return () => unsubscribe();
  }, [app, emitNotification, watchFirestore]);
};

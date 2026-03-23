import axios from "axios";
import {
  FETCH_NOTIFICATIONS,
  SET_NOTIF_LOADING,
  MARK_NOTIF_READ,
  MARK_ALL_NOTIF_READ,
  DELETE_NOTIF,
} from "./notificationReducer";
import { buildApiUrl } from "../utils/api";
import { normalizeNotificationPayload } from "./notificationScope";
import firebase, { auth, db } from "../firebase";

const NOTIF_URL = buildApiUrl("/api/notifications");

const normalizeFirestoreNotification = (docSnapshot) => {
  const data = docSnapshot.data() || {};
  const createdAt =
    typeof data.createdAt?.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : data.createdAt || new Date().toISOString();

  return {
    _id: docSnapshot.id,
    source: "firestore",
    app: data.app || "",
    type: data.type || "notification",
    title: data.title || "Notification",
    message: data.message || "",
    recipientEmail: data.recipientEmail || "",
    entityId: data.entityId || "",
    entityName: data.entityName || "",
    read: Boolean(data.read),
    createdAt,
    updatedAt:
      typeof data.updatedAt?.toDate === "function"
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt || createdAt,
  };
};

const fetchFirestoreNotifications = async () => {
  const currentEmail = String(auth.currentUser?.email || "").trim().toLowerCase();
  if (!currentEmail) {
    return [];
  }

  const snapshot = await db
    .collection("notifications")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs
    .map(normalizeFirestoreNotification)
    .filter(
      (notification) =>
        notification.app === "learntekin-live" &&
        (!notification.recipientEmail ||
          notification.recipientEmail === currentEmail)
    );
};

const mergeNotifications = (backendPayload, firestoreItems) => {
  const backendNormalized = normalizeNotificationPayload(backendPayload);
  const backendItems = (backendNormalized.notifications || []).map((notification) => ({
    ...notification,
    source: notification.source || "api",
  }));
  const items = [...backendItems, ...firestoreItems].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  return {
    notifications: items,
    unreadCount: items.filter((notification) => !notification.read).length,
  };
};

export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: SET_NOTIF_LOADING, payload: true });
  try {
    const [apiResult, firestoreResult] = await Promise.allSettled([
      axios.get(NOTIF_URL),
      fetchFirestoreNotifications(),
    ]);

    const apiPayload =
      apiResult.status === "fulfilled" ? apiResult.value.data : { notifications: [] };
    const firestoreItems =
      firestoreResult.status === "fulfilled" ? firestoreResult.value : [];

    dispatch({
      type: FETCH_NOTIFICATIONS,
      payload: mergeNotifications(apiPayload, firestoreItems),
    });
  } catch (err) {
    console.error("[notifications] fetch failed:", err.message);
    dispatch({ type: SET_NOTIF_LOADING, payload: false });
  }
};

export const markNotificationRead = (id, source = "api") => async (dispatch) => {
  try {
    if (source === "firestore") {
      await db.collection("notifications").doc(id).set(
        {
          read: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          readAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await axios.patch(`${NOTIF_URL}/${id}/read`);
    }
    dispatch({ type: MARK_NOTIF_READ, payload: id });
  } catch (err) {
    console.error("[notifications] mark read failed:", err.message);
  }
};

export const markAllNotificationsRead = () => async (dispatch, getState) => {
  const unreadItems = getState()
    .notifications.items.filter((notification) => !notification.read)
    .map((notification) => ({
      id: notification._id,
      source: notification.source || "api",
    }))
    .filter((notification) => Boolean(notification.id));

  if (unreadItems.length === 0) {
    return;
  }

  try {
    const results = await Promise.allSettled(
      unreadItems.map((notification) =>
        notification.source === "firestore"
          ? db.collection("notifications").doc(notification.id).set(
              {
                read: true,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                readAt: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            )
          : axios.patch(`${NOTIF_URL}/${notification.id}/read`)
      )
    );
    const successfulIds = unreadItems
      .filter(
        (_, index) => results[index].status === "fulfilled"
      )
      .map((notification) => notification.id);

    if (successfulIds.length > 0) {
      dispatch({ type: MARK_ALL_NOTIF_READ, payload: successfulIds });
    }

    if (successfulIds.length !== unreadItems.length) {
      console.error("[notifications] some mark-all updates failed");
    }
  } catch (err) {
    console.error("[notifications] mark all read failed:", err.message);
  }
};

export const deleteNotificationById = (id, source = "api") => async (dispatch) => {
  try {
    if (source === "firestore") {
      await db.collection("notifications").doc(id).delete();
    } else {
      await axios.delete(`${NOTIF_URL}/${id}`);
    }
    dispatch({ type: DELETE_NOTIF, payload: id });
  } catch (err) {
    console.error("[notifications] delete failed:", err.message);
  }
};

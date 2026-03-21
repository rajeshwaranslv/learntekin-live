import axios from "axios";
import {
  FETCH_NOTIFICATIONS,
  SET_NOTIF_LOADING,
  MARK_NOTIF_READ,
  MARK_ALL_NOTIF_READ,
  DELETE_NOTIF,
} from "./notificationReducer";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/$/, "");
const NOTIF_URL = API_BASE ? `${API_BASE}/api/notifications` : "/api/notifications";

export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: SET_NOTIF_LOADING, payload: true });
  try {
    const res = await axios.get(NOTIF_URL);
    dispatch({ type: FETCH_NOTIFICATIONS, payload: res.data });
  } catch (err) {
    console.error("[notifications] fetch failed:", err.message);
    dispatch({ type: SET_NOTIF_LOADING, payload: false });
  }
};

export const markNotificationRead = (id) => async (dispatch) => {
  try {
    await axios.patch(`${NOTIF_URL}/${id}/read`);
    dispatch({ type: MARK_NOTIF_READ, payload: id });
  } catch (err) {
    console.error("[notifications] mark read failed:", err.message);
  }
};

export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    await axios.patch(`${NOTIF_URL}/read-all`);
    dispatch({ type: MARK_ALL_NOTIF_READ });
  } catch (err) {
    console.error("[notifications] mark all read failed:", err.message);
  }
};

export const deleteNotificationById = (id) => async (dispatch) => {
  try {
    await axios.delete(`${NOTIF_URL}/${id}`);
    dispatch({ type: DELETE_NOTIF, payload: id });
  } catch (err) {
    console.error("[notifications] delete failed:", err.message);
  }
};

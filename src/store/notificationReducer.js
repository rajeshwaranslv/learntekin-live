export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";
export const SET_NOTIF_LOADING = "SET_NOTIF_LOADING";
export const MARK_NOTIF_READ = "MARK_NOTIF_READ";
export const MARK_ALL_NOTIF_READ = "MARK_ALL_NOTIF_READ";
export const DELETE_NOTIF = "DELETE_NOTIF";

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

const countUnread = (items = []) =>
  items.filter((notification) => !notification.read).length;

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIF_LOADING:
      return { ...state, loading: action.payload };

    case FETCH_NOTIFICATIONS: {
      const items = action.payload?.notifications || [];
      return {
        ...state,
        items,
        unreadCount:
          typeof action.payload?.unreadCount === "number"
            ? action.payload.unreadCount
            : countUnread(items),
        loading: false,
      };
    }

    case MARK_NOTIF_READ: {
      const items = state.items.map((n) =>
        n._id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        items,
        unreadCount: countUnread(items),
      };
    }

    case MARK_ALL_NOTIF_READ: {
      const ids = Array.isArray(action.payload)
        ? new Set(action.payload)
        : null;
      const items = state.items.map((n) =>
        !ids || ids.has(n._id) ? { ...n, read: true } : n
      );
      return {
        ...state,
        items,
        unreadCount: countUnread(items),
      };
    }

    case DELETE_NOTIF: {
      const items = state.items.filter((n) => n._id !== action.payload);
      return {
        ...state,
        items,
        unreadCount: countUnread(items),
      };
    }

    default:
      return state;
  }
};

export default notificationReducer;

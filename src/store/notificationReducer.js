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

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIF_LOADING:
      return { ...state, loading: action.payload };

    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        items: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        loading: false,
      };

    case MARK_NOTIF_READ: {
      const wasUnread = state.items.find((n) => n._id === action.payload && !n.read);
      return {
        ...state,
        items: state.items.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }

    case MARK_ALL_NOTIF_READ:
      return {
        ...state,
        items: state.items.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };

    case DELETE_NOTIF: {
      const deleted = state.items.find((n) => n._id === action.payload);
      return {
        ...state,
        items: state.items.filter((n) => n._id !== action.payload),
        unreadCount:
          deleted && !deleted.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }

    default:
      return state;
  }
};

export default notificationReducer;

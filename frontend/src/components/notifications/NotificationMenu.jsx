/* eslint-disable react-hooks/set-state-in-effect -- notifications are loaded from the API after mount. */
import { useCallback, useEffect, useState } from "react";
import { BellIcon } from "../common/Icons";
import { getMyNotifications, markNotificationRead } from "../../api/notifications";
import "./NotificationMenu.css";

function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getMyNotifications();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleOpen = () => {
    setOpen((current) => !current);
    if (!open) loadNotifications();
  };

  const markRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((current) => current.map((notification) => notification._id === notificationId ? { ...notification, readAt: new Date().toISOString() } : notification));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="notification-menu">
      <button type="button" className="notification-button" onClick={handleOpen} aria-expanded={open} aria-label="Notifications">
        <BellIcon size={16} />
        <span>{unreadCount}</span>
      </button>
      {open && (
        <section className="notification-popover" aria-label="Farmer notifications">
          <h2>Notifications</h2>
          {error && <p className="notification-error">{error}</p>}
          {!error && notifications.length === 0 && <p className="notification-empty">No notifications yet.</p>}
          {notifications.map((notification) => (
            <button type="button" className={notification.readAt ? "notification-item" : "notification-item unread"} key={notification._id} onClick={() => !notification.readAt && markRead(notification._id)}>
              <strong>{notification.title}</strong>
              <span>{notification.message}</span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}

export default NotificationMenu;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsButton = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔹 Fetch notifications list
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/${userId}`
      );
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  // 🔹 Fetch unread count
  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/${userId}/unread-count`
      );
      setUnreadCount(res.data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  // 🔹 When opening the dropdown
  const handleToggle = async () => {
    const newOpen = !open;
    setOpen(newOpen);

    if (!open && userId) {
      // Mark all as read when user opens notifications
      try {
        await axios.put(
          `http://localhost:5000/api/notifications/${userId}/mark-read`
        );
        setUnreadCount(0);
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-youtube-hover relative"
        onClick={handleToggle}
      >
        <Bell className="h-5 w-5" />

        {/* 🔴 Red badge with number */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground text-center">
              No notifications
            </p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id || n.message}
                  className="flex items-start px-3 py-2 hover:bg-muted border-b border-border text-sm space-x-2"
                >
                  {n.avatar && (
                    <img
                      src={`http://localhost:5000/${n.avatar}`}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <p>{n.message}</p>
                    {n.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsButton;

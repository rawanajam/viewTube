import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsButton = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        // Ensure res.data is always an array
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-youtube-hover"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
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
                  key={n.id || n.message} // fallback in case id is missing
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

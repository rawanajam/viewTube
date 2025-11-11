import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ Get userId from localStorage (set after login)
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || userId === "null") return; // avoid null error

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
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
        <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground text-center">
              No notifications
            </p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-muted text-sm border-b border-border"
                >
                  {n.message}
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

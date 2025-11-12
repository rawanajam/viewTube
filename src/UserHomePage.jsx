import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
import { Play, Music, Gamepad2, Flame, Newspaper, Download, Clock, ThumbsUp, LogOut } from "lucide-react";

const UserHomePage = () => {
  const [user, setUser] = useState(null); // store user info
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/me", { withCredentials: true });
        setUser(userRes.data);

        if (userRes.data.channel_id) {
          const videoRes = await axios.get(`http://localhost:5000/api/videos?channel=${userRes.data.channel_id}`);
          setVideos(videoRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14">
      {/* Profile Section */}
      <div className="flex items-center gap-4 py-6 border-b border-neutral-800">
        {/* Avatar or First Letter */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-red-600">
            {user?.username?.[0].toUpperCase() || "U"}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">{user?.username || "Username"}</h2>
          <p className="text-gray-400 text-sm">Joined {user?.joined || "Jan 2025"}</p>
        </div>

        {/* Conditional buttons */}
        {!user?.channel_id && (
          <button className="ml-auto bg-red-600 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded">
            Create Channel
          </button>
        )}
        <button
          onClick={handleLogout}
          className="ml-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* User Navigation Tabs */}
      <div className="flex gap-3 overflow-x-auto py-3 border-b border-neutral-800 sticky top-14 bg-background z-10">
        {[
          { icon: <Play className="h-4 w-4" />, label: "Videos" },
          { icon: <ThumbsUp className="h-4 w-4" />, label: "Likes" },
          { icon: <Clock className="h-4 w-4" />, label: "History" ,},
          { icon: <Download className="h-4 w-4" />, label: "Downloads" },
        ].map((tab, i) => (
          <button
            key={i}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-sm text-gray-200 rounded-full px-4 py-2 whitespace-nowrap"
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Videos (if any) */}
      {user?.channel_id ? (
        <div className="grid gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                thumbnail={video.thumbnail}
                title={video.title}
                channel={video.channel}
                views={video.views}
                timestamp={video.timestamp}
                duration={video.duration}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">
              You haven’t uploaded any videos yet.
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 mt-10 text-center">
          You don’t have a channel yet. Click “Create Channel” to start uploading videos.
        </p>
      )}
    </div>
  );
};

export default UserHomePage;

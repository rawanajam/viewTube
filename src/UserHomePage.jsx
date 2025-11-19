import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
import { Play, ThumbsUp, Clock, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatViews } from "./utils/formatViews";
import { formatTimeAgo } from "./utils/formatTimeAgo";
import { Link } from "react-router-dom";

const UserHomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Videos");
  const [likedVideos, setLikedVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [videosD, setDVideos] = useState([]);
  const userId = localStorage.getItem("user_id");


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    if (parsedUser?.channel_id) {
      const storedVideos = localStorage.getItem("videos");
      setVideos(storedVideos ? JSON.parse(storedVideos) : []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
  if (!user?.channel_id) return;

  const fetchMyVideos = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/channel/${user.channel_id}/videos`
      );
      console.log("CHANNEL VIDEOS:", res.data); // DEBUG
      setVideos(res.data);
      localStorage.setItem("videos", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching channel videos:", err);
    }
  };

  fetchMyVideos();
}, [user]);



  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/likes/${userId}`);
        setLikedVideos(response.data);
      } catch (error) {
        console.error("Error fetching liked videos:", error);
      }
    };

    if (userId) fetchLikedVideos();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching watch history:", err);
      }
    };

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchDownloads = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/downloads/${userId}`);
        setDVideos(res.data);
      } catch (err) {
        console.error("Error fetching downloads:", err);
      }
    };
    fetchDownloads();
  }, [userId]);


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
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
      <div className="flex items-center gap-4 py-6 border-b border-neutral-800 px-4">
        {/* Avatar or First Letter */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-red-600">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">{user?.username || "Username"}</h2>
          <p className="text-gray-400 text-sm">Joined {user?.joined || "Jan 2025"}</p>
        </div>

        {/* Conditional buttons */}
        {!user?.channel_id && (
          <button className="ml-auto bg-red-600 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
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
      <div className="flex gap-3 overflow-x-auto py-3 border-b border-neutral-800 sticky top-14 bg-background z-10 px-4">
          {[
            { icon: <Play className="h-4 w-4" />, label: "Videos" },
            { icon: <ThumbsUp className="h-4 w-4" />, label: "Likes" },
            { icon: <Clock className="h-4 w-4" />, label: "History" },
            { icon: <Download className="h-4 w-4" />, label: "Downloads" },
          ].map((tab, i) => (
            <button
              key={i}
              onClick={() => setSelectedTab(tab.label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap text-sm
                ${selectedTab === tab.label ? "bg-red-600 text-white" : "bg-neutral-800 hover:bg-neutral-700 text-gray-200"}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>



      {/* User Videos (if any) */}
      <div className="px-4 mt-6">
      {selectedTab === "Videos" && (
        user?.channel_id ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  channel={video.channel}
                  views={formatViews(video.views)}
                  timestamp={formatTimeAgo(video.created_at)}
                  duration={video.duration || "00:00"}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                You haven't uploaded any videos yet.
              </p>
            )}
          </div>
        ) : (
      <p className="text-gray-400 text-center">
        You don’t have a channel yet. Click “Create Channel” to start uploading videos.
      </p>
    )
  )}

  {selectedTab === "Likes" && (
  likedVideos.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {likedVideos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          thumbnail={video.thumbnail}
          title={video.title}
          channel={video.channel}
          views={formatViews(video.views)}
          timestamp={formatTimeAgo(video.created_at)}
          duration={video.duration || "00:00"}
        />
      ))}
    </div>
  ) : (
    <p className="text-gray-400">No liked videos yet.</p>
  )
)}

  {selectedTab === "History" && (
    history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((video) => (
                <Link
                  to={`/video/${video.id}`}
                  key={video.id}
                  className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
                >
                  <img
                    src={
                      video.thumbnail
                        ? video.thumbnail.startsWith("/assets")
                          ? video.thumbnail
                          : `http://localhost:5000/uploads/${video.thumbnail}`
                        : "/assets/placeholder.jpg"
                    }
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-sm text-white line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-400">{video.channel}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No watch history yet.</p>)
          )}

  {selectedTab === "Downloads" && (
    videosD.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videosD.map((video) => (
                <Link
                  to={`/video/${video.id}`}
                  key={video.id}
                  className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
                >
                  <img
                    src={
                        video.thumbnail
                        ? video.thumbnail.startsWith("/assets")
                            ? video.thumbnail
                            : `http://localhost:5000/uploads/${video.thumbnail}`
                        : "/assets/placeholder.jpg"
                    }
                    alt={video.title}
                    className="w-full h-40 object-cover"
                    />
    
                  <div className="p-3">
                    <p className="font-semibold text-sm text-white line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-400">{video.channel}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No downloads yet.</p>)
          )}
</div>
</div>
  );
};

export default UserHomePage;

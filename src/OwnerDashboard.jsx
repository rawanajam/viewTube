import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Users,
  Video,
  Eye,
  Trash2,
  Ban,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { formatViews } from "./utils/formatViews";
import { formatTimeAgo } from "./utils/formatTimeAgo";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [analytics, setAnalytics] = useState({
    totalChannels: 0,
    totalVideos: 0,
    totalViews: 0,
    totalUsers: 0,
  });

  const [selectedTab, setSelectedTab] = useState("Analytics");

  const token = localStorage.getItem("token");
 const role = localStorage.getItem("role");
const adminId = localStorage.getItem("user_id");

useEffect(() => {
  if (!token || role !== "admin") {
    navigate("/login");
  }
}, [token, role]);


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ------------------------------
  //  FETCH ADMIN DATA
  // ------------------------------
  const fetchAllData = async () => {
    try {
      const channelsRes = await axios.get(
        "http://localhost:5000/api/admin/channels",
        config
      );

      const videosRes = await axios.get(
        "http://localhost:5000/api/admin/videos",
        config
      );

      const statsRes = await axios.get(
        "http://localhost:5000/api/admin/analytics",
        config
      );

      setChannels(channelsRes.data);
      setVideos(videosRes.data);
      setAnalytics(statsRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ------------------------------
  // DELETE VIDEO
  // ------------------------------
  const deleteVideo = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/delete-video/${id}`,
        {},
        config
      );

      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ------------------------------
  // BAN VIDEO
  // ------------------------------
  const banVideo = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/ban-video/${id}`,
        {},
        config
      );
      alert("Video banned");
    } catch (err) {
      console.error("Ban failed:", err);
    }
  };

  // ------------------------------
  // BAN CHANNEL
  // ------------------------------
  const banChannel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/ban-channel/${id}`,
        {},
        config
      );

      setChannels((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Ban channel failed:", err);
    }
  };

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const logout = () => {
    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14 px-4">

      {/* HEADER */}
      <div className="flex items-center gap-4 py-6 border-b border-neutral-800">
        {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-red-500 uppercase">
            {"O"}
          </div>

        <div>
          <h2 className="text-xl font-semibold">Owner Dashboard</h2>
          <p className="text-gray-400 text-sm">Platform control panel</p>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="ml-auto bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 overflow-x-auto py-3 border-b border-neutral-800 sticky top-14 bg-background z-10">
        {[
          { icon: <BarChart className="h-4 w-4" />, label: "Analytics" },
          { icon: <Users className="h-4 w-4" />, label: "Channels" },
          { icon: <Video className="h-4 w-4" />, label: "Videos" },
        ].map((tab, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(tab.label)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm
              ${
                selectedTab === tab.label
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-gray-200"
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ANALYTICS */}
      {selectedTab === "Analytics" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-6">
          <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg">
            <p className="text-gray-400 text-sm">Total Channels</p>
            <h2 className="text-3xl font-bold">{analytics.totalChannels}</h2>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg">
            <p className="text-gray-400 text-sm">Total Videos</p>
            <h2 className="text-3xl font-bold">{analytics.totalVideos}</h2>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Eye className="h-4 w-4" /> Total Views
            </p>
            <h2 className="text-3xl font-bold">
              {formatViews(analytics.totalViews)}
            </h2>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg">
            <p className="text-gray-400 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold">{analytics.totalUsers}</h2>
          </div>
        </div>
      )}

      {/* CHANNELS TAB */}
      {selectedTab === "Channels" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
          {channels.length > 0 ? (
            channels.map((ch) => (
              <div
                key={ch.id}
                className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg relative group"
              >
                <div className="absolute top-3 right-3 hidden group-hover:flex gap-2">
                  <button
                    onClick={() => banChannel(ch.id)}
                    className="bg-yellow-600 p-2 rounded-lg hover:bg-yellow-700"
                  >
                    <Ban size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {ch.avatar ? (
                    <img
                      src={ch.avatar}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={ch.name}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                      {ch.name?.charAt(0) || "U"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{ch.name}</p>
                    <p className="text-sm text-gray-400">ID: {ch.id}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Total Videos: {ch.video_count}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No channels available
            </p>
          )}
        </div>
      )}

      {/* VIDEOS TAB */}
      {selectedTab === "Videos" && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="relative group">
                <div className="absolute top-3 right-3 hidden group-hover:flex gap-2 z-10">
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="bg-red-600 p-2 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => banVideo(video.id)}
                    className="bg-yellow-600 p-2 rounded-lg hover:bg-yellow-700"
                  >
                    <Ban size={16} />
                  </button>
                </div>

                <VideoCard
                  id={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  channel={video.channel}
                  views={formatViews(video.views)}
                  timestamp={formatTimeAgo(video.created_at)}
                  duration={video.duration || "00:00"}
                  channelAvatar={video.channel_avatar}
                  customLink={`/channel/video/${video.id}`}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No videos found
            </p>
          )}
        </div>
      )}

      {/* LOGOUT POPUP */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-80 text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Are you sure you want to logout?
            </h3>

            <div className="flex gap-3">
              <button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
              >
                Yes, Logout
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerDashboard;

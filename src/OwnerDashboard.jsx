import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Users,
  Video,
  Eye,
  Trash2,
  Ban,
  LogOut,
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
  const [selectedTab, setSelectedTab] = useState("Analytics");

  const [analytics, setAnalytics] = useState({
    totalChannels: 0,
    totalVideos: 0,
    totalViews: 0,
    totalUsers: 0,
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [token, role, navigate]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ------------------------------
  // FETCH DATA
  // ------------------------------
  const fetchAllData = async () => {
    try {
      const [channelsRes, videosRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/channels", config),
        axios.get("http://localhost:5000/api/admin/videos", config),
        axios.get("http://localhost:5000/api/admin/analytics", config),
      ]);

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
      console.error(err);
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
      setVideos((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: "banned" } : v
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // BAN CHANNEL
  // ------------------------------
  const banChannel = async (e, id) => {
    e.stopPropagation(); // 🔥 prevent navigation

    try {
      await axios.put(
        `http://localhost:5000/api/admin/ban-channel/${id}`,
        {},
        config
      );

      setChannels((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "banned" } : c
        )
      );

      setVideos((prev) =>
        prev.map((v) =>
          v.channel_id === id ? { ...v, status: "banned" } : v
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14 px-4">

      {/* HEADER */}
      <div className="flex items-center gap-4 py-6 border-b border-neutral-800">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
          O
        </div>

        <div>
          <h2 className="text-xl font-semibold">Owner Dashboard</h2>
          <p className="text-gray-400 text-sm">Platform control panel</p>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="ml-auto bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 py-3 border-b border-neutral-800 sticky top-14 bg-background z-10">
        {["Analytics", "Channels", "Videos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedTab === tab
                ? "bg-red-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
        {/* ANALYTICS / STATISTICS */}
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
          {channels.length ? (
            channels.map((ch) => (
              <div
                key={ch.id}
                onClick={() => navigate(`/channel/${ch.id}`)} // ✅ OPEN CHANNEL
                className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg relative cursor-pointer hover:border-red-600 transition"
              >
                {/* Ban / Status */}
                <div className="absolute top-3 right-3">
                  {ch.status !== "banned" ? (
                    <button
                      onClick={(e) => banChannel(e, ch.id)}
                      className="bg-yellow-600 p-2 rounded hover:bg-yellow-700"
                    >
                      <Ban size={16} />
                    </button>
                  ) : (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      BANNED
                    </span>
                  )}
                </div>

                {/* Channel info */}
                <div className="flex items-center gap-3">
                  {ch.avatar ? (
                    <img
                      src={ch.avatar}
                      className="w-12 h-12 rounded-full"
                      alt={ch.name}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                      {ch.name?.charAt(0) || "U"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{ch.name}</p>
                    {ch.status === "banned" && (
                      <p className="text-xs text-red-500 font-semibold">
                        Channel Banned
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      Videos: {ch.video_count}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No channels found
            </p>
          )}
        </div>
      )}

      {/* VIDEOS TAB */}
      {selectedTab === "Videos" && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`relative group ${
                video.status === "banned" ? "opacity-60" : ""
              }`}
            >
              {video.status === "banned" && (
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
                  BANNED
                </div>
              )}

              {video.status !== "banned" && (
                <div className="absolute top-3 right-3 hidden group-hover:flex gap-2 z-10">
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="bg-red-600 p-2 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => banVideo(video.id)}
                    className="bg-yellow-600 p-2 rounded hover:bg-yellow-700"
                  >
                    <Ban size={16} />
                  </button>
                </div>
              )}

              <VideoCard
                {...video}
                views={formatViews(video.views)}
                timestamp={formatTimeAgo(video.created_at)}
                customLink={`/channel/video/${video.id}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-900 p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg mb-4">Logout?</h3>
            <div className="flex gap-3">
              <button
                onClick={logout}
                className="w-full bg-red-600 py-2 rounded"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-neutral-700 py-2 rounded"
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

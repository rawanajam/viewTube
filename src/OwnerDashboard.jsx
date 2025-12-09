import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
import { BarChart, Users, Video, Eye } from "lucide-react";
import { formatViews } from "./utils/formatViews";
import { formatTimeAgo } from "./utils/formatTimeAgo";

const OwnerDashboard = () => {
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalChannels: 0,
    totalVideos: 0,
    totalViews: 0,
    totalUsers: 0,
  });
  const [selectedTab, setSelectedTab] = useState("Analytics");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

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

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14 px-4">

      {/* Header */}
      <div className="flex items-center gap-4 py-6 border-b border-neutral-800">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
        <div>
          <h2 className="text-xl font-semibold">Owner Dashboard</h2>
          <p className="text-gray-400 text-sm">Platform control panel</p>
        </div>
      </div>

      {/* Tabs */}
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
              ${selectedTab === tab.label
                ? "bg-red-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-gray-200"}
            `}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
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
            <h2 className="text-3xl font-bold">{formatViews(analytics.totalViews)}</h2>
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
                className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={ch.avatar || "/assets/avatar.png"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{ch.name}</p>
                    <p className="text-sm text-gray-400">@{ch.handle}</p>
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
              <VideoCard
                key={video.id}
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
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No videos found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

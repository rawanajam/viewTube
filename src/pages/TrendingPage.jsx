import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatViews } from "../utils/formatViews";

const TrendingPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/trending")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching trending videos:", err));
  }, []);

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        🔥 Trending Now
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-400">No trending videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              thumbnail={video.thumbnail}
              title={video.title}
              channel={video.channel}
              views={formatViews(video.views)}
              timestamp={formatTimeAgo(video.created_at)}
              channelAvatar={video.channel_avatar}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default TrendingPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { formatViews } from "@/utils/formatViews";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/videos/search?q=${query}`
        );
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchVideos();
  }, [query]);

  return (
    <div className="pt-14 pl-4">
      <h2 className="text-xl font-semibold mb-4">
        Search results for “{query}”
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
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
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No videos found.</p>
      )}
    </div>
  );
};

export default SearchResults;

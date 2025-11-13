import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/search?q=${query}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) fetchVideos();
  }, [query]);

  return (
    <div className="pt-14 pl-4">
      <h2 className="text-xl font-semibold mb-4">
        Search results for “{query}”
      </h2>

      {videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              channel={video.channel}
              views={video.views}
              timestamp={video.timestamp}
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

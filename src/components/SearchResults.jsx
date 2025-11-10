import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard"; // reuse the same card

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/search?q=${query}`);
        // Map backend data to match VideoCard props
        const mappedVideos = res.data.map((v) => ({
          id: v.id,
          thumbnail: v.thumbnail ? `http://localhost:5000/uploads/${v.thumbnail}` : "/assets/placeholder.jpg",
          title: v.title,
          channel: v.channel || "Unknown",
          views: v.views,
          timestamp: v.created_at,
          duration: v.duration || "0:00",
        }));

        setVideos(mappedVideos);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <main className="pt-14">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">
          Search Results for “{query}”
        </h2>

        {videos.length === 0 ? (
          <p className="text-center mt-10 text-muted-foreground">
            No videos found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;

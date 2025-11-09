import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatViews } from "../utils/formatViews";

const LikedVideosPage = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const userId = localStorage.getItem("user_id");

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

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      {/* 👆 added same padding and structure as your other pages */}
      <h2 className="text-2xl font-semibold mb-6">Liked Videos</h2>

      {likedVideos.length > 0 ? (
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
      )}
    </main>
  );
};

export default LikedVideosPage;

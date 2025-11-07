import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";

const LikedVideosPage = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const userId = localStorage.getItem("userId");

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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Liked Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {likedVideos.length > 0 ? (
          likedVideos.map((video) => <VideoCard key={video.id} {...video} />)
        ) : (
          <p>No liked videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default LikedVideosPage;

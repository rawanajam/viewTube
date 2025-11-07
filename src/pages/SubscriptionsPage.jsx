import React, { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";

const SubscriptionsPage = () => {
  const [videos, setVideos] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSubscribedVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/subscriptions/${userId}`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching subscribed videos:", error);
      }
    };

    if (userId) fetchSubscribedVideos();
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Subscribed Channels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video.id} {...video} />)
        ) : (
          <p>No videos from subscribed channels yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;

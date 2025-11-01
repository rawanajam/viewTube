import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatViews } from "../utils/formatViews";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  // Local like/dislike state
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState(null); // "like", "dislike", or null

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);

        // Optional: initialize likes/dislikes from DB if available
        setLikes(res.data.likes || 0);
        setDislikes(res.data.dislikes || 0);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = () => {
    if (userAction === "like") {
      setLikes(likes - 1);
      setUserAction(null);
    } else {
      setLikes(likes + 1);
      if (userAction === "dislike") setDislikes(dislikes - 1);
      setUserAction("like");
    }
  };

  const handleDislike = () => {
    if (userAction === "dislike") {
      setDislikes(dislikes - 1);
      setUserAction(null);
    } else {
      setDislikes(dislikes + 1);
      if (userAction === "like") setLikes(likes - 1);
      setUserAction("dislike");
    }
  };

  if (!video) return <div className="pt-14 text-center">Loading...</div>;

  return (
    <main className="pt-14 container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <video
            controls
            className="w-full rounded-xl mb-4"
            src={`http://localhost:5000${video.videoUrl}`}
          />

          <h1 className="text-xl font-bold mb-2">{video.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{video.channel}</p>
          <p className="text-gray-700 mb-4">{video.description}</p>
          <p className="text-xs text-gray-500 mb-4">
            {formatViews(video.views)} views
          </p>

          {/* YouTube-style Like/Dislike */}
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                userAction === "like"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={handleLike}
            >
              👍 {likes}
            </button>
            <button
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                userAction === "dislike"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={handleDislike}
            >
              👎 {dislikes}
            </button>
          </div>
        </div>

        <aside className="w-full lg:w-80">
          <h3 className="font-semibold mb-3">Recommended</h3>
          {/* Recommended videos */}
        </aside>
      </div>
    </main>
  );
};

export default VideoPage;

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatViews } from "../utils/formatViews";

const CategoryPage = () => {
  const { category } = useParams();
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("user_id");

  // Fetch category videos
  useEffect(() => {
    const fetchCategoryVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/category/${category}`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching category videos:", error);
      }
    };

    fetchCategoryVideos();
  }, [category]);

  // Fetch user info for header avatar
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error("Error fetching user info:", err));
    }
  }, [userId]);

  return (
    <main className="pt-14">
      <div className="container mx-auto px-4 py-6">
        {/* Header Avatar Example */}
        <div className="flex items-center mb-4">
          {user && (
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <h1 className="text-2xl font-semibold capitalize">{category} Videos</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {/* Message if no videos */}
          {videos.length === 0 && (
            <div className="col-span-full flex flex-col items-center mt-10 opacity-70">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
                alt="No videos"
                className="w-40 mb-4"
              />
              <p className="text-xl font-medium">
                No videos found in this category
              </p>
            </div>
          )}

          {/* Actual videos */}
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              channel={video.channel}
              views={formatViews(video.views)}
              timestamp={formatTimeAgo(video.created_at)}
              duration={video.duration || "00:00"}
              channelAvatar={video.channel_avatar}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;

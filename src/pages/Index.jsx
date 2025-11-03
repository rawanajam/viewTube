import { useEffect, useState } from "react";
import { VideoCard } from "@/components/VideoCard";
import { formatViews } from "../utils/formatViews";

const Index = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <main className="pt-14">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              thumbnail={video.thumbnail}
              title={video.title}
              channel={video.channel}
              views={formatViews(video.views)}
              timestamp={new Date(video.created_at).toLocaleDateString()}
              duration={video.duration || "00:00"}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Index;

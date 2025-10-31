import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";

const CategoryPage = () => {
  const { category } = useParams(); // 👈 get the category from the URL
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/videos/category/${category}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, [category]);

  return (
    <main className="pt-14">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 capitalize">
          {category} Videos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              thumbnail={video.thumbnail}
              title={video.title}
              channel={video.channel}
              views={`${(video.views / 1000000).toFixed(1)}M`}
              timestamp="Just now"
              duration="10:00"
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;

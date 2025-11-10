import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ChannelPage = () => {
  const { id } = useParams(); // channel id from URL
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const channelRes = await axios.get(`http://localhost:5000/api/channels/${id}`);
        setChannel(channelRes.data);

        const videosRes = await axios.get(`http://localhost:5000/api/channels/${id}/videos`);
        setVideos(videosRes.data);
      } catch (err) {
        console.error("Error fetching channel:", err);
      }
    };

    if (id) fetchChannelData();
  }, [id]);

  if (!channel) {
    return <p className="text-white text-center mt-20">Loading channel...</p>;
  }

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      {/* Channel header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            channel.avatar
              ? `http://localhost:5000/${channel.avatar}`
              : "/assets/channel-placeholder.jpg"
          }
          alt={channel.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{channel.name}</h1>
          <p className="text-gray-400">{channel.subscriber_count} subscribers</p>
          {channel.description && (
            <p className="text-gray-300 mt-2 max-w-xl">{channel.description}</p>
          )}
        </div>
      </div>


      {/* Videos */}
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800"
            >
              <img
                src={video.thumbnail || "/assets/placeholder.jpg"}
                alt={video.title}
                className="w-full h-32 object-cover"
              />
              <p className="p-2 text-sm">{video.title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">This channel has no videos yet.</p>
      )}
    </main>
  );
};

export default ChannelPage;

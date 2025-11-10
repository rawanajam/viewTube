import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching watch history:", err);
      }
    };

    fetchHistory();
  }, [userId]);

  if (!userId)
    return (
      <main className="pt-16 min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your watch history.</p>
      </main>
    );

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">📺 Watch History</h1>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((video) => (
            <Link
              to={`/video/${video.id}`}
              key={video.id}
              className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
            >
              <img
                src={
                  video.thumbnail
                    ? video.thumbnail.startsWith("/assets")
                      ? video.thumbnail
                      : `http://localhost:5000/uploads/${video.thumbnail}`
                    : "/assets/placeholder.jpg"
                }
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-sm text-white line-clamp-2">
                  {video.title}
                </p>
                <p className="text-xs text-gray-400">{video.channel}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No watch history yet.</p>
      )}
    </main>
  );
};

export default HistoryPage;

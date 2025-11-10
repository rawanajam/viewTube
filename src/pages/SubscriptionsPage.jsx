import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SubscriptionsPage = () => {
  const [channels, setChannels] = useState([]);
  const userId = localStorage.getItem("user_id"); // make sure the key matches your storage

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/subscriptions/${userId}/channels`);
        setChannels(res.data);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };

    if (userId) fetchSubscribedChannels();
  }, [userId]);

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Your Subscriptions</h2>
      {channels.length > 0 ? (
        <ul className="space-y-4">
            {channels.map((channel) => (
              <Link
                key={channel.id}
                to={`/channel/${channel.id}`}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer no-underline"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      channel.avatar
                        ? `http://localhost:5000/${channel.avatar}`
                        : "/assets/channel-placeholder.jpg"
                    }
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{channel.name}</p>
                    {channel.description && (
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {channel.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-gray-400">{channel.subscriber_count} subscribers</span>
              </Link>
            ))}
          </ul>

      ) : (
        <p className="text-gray-500">You are not subscribed to any channels yet.</p>
      )}
    </main>
  );
};

export default SubscriptionsPage;
